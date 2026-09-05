'use client'

import { apiFetch } from '@/lib/urls'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Plus, Edit2, Trash2, X, Calendar } from 'lucide-react'

interface DiaryItem {
  id: string
  title: string
  content: string
  mood?: string | null
  weather?: string | null
  catId?: string | null
  cat?: { name: string } | null
  createdAt: string
}

interface Cat {
  id: string
  name: string
}

const moodOptions = ['😊', '😺', '😴', '🤔', '😋', '😿']
const weatherOptions = ['☀️', '⛅', '🌧️', '❄️', '🌈']

export default function DiaryManagementPage() {
  const [diary, setDiary] = useState<DiaryItem[]>([])
  const [cats, setCats] = useState<Cat[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<DiaryItem | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: '',
    weather: '',
    catId: '',
  })

  useEffect(() => {
    Promise.all([
      apiFetch('/api/diary?pageSize=50').then((res) => res.json()),
      apiFetch('/api/cats').then((res) => res.json()),
    ]).then(([diaryRes, catsRes]) => {
      if (diaryRes.success) setDiary(diaryRes.data.items)
      if (catsRes.success) setCats(catsRes.data)
      setLoading(false)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const data = {
      ...formData,
      catId: formData.catId || null,
      mood: formData.mood || null,
      weather: formData.weather || null,
    }

    try {
      if (editingItem) {
        const res = await apiFetch(`/api/diary/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        const result = await res.json()
        if (result.success) {
          setDiary((prev) =>
            prev.map((item) =>
              item.id === editingItem.id
                ? { ...item, ...data, cat: result.data.cat }
                : item
            )
          )
        }
      } else {
        const res = await apiFetch('/api/diary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        const result = await res.json()
        if (result.success) {
          setDiary((prev) => [result.data, ...prev])
        }
      }
    } catch (error) {
      console.error('Save failed:', error)
    }

    setShowModal(false)
    setEditingItem(null)
    setFormData({ title: '', content: '', mood: '', weather: '', catId: '' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这篇日记吗？')) return

    try {
      const res = await apiFetch(`/api/diary/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setDiary((prev) => prev.filter((item) => item.id !== id))
      }
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const openEditModal = (item: DiaryItem) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      content: item.content,
      mood: item.mood || '',
      weather: item.weather || '',
      catId: item.catId || '',
    })
    setShowModal(true)
  }

  const openCreateModal = () => {
    setEditingItem(null)
    setFormData({ title: '', content: '', mood: '', weather: '', catId: '' })
    setShowModal(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <BookOpen className="w-8 h-8 text-primary-500" />
        </motion.div>
      </div>
    )
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif font-bold">日记管理</h1>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            写日记
          </button>
        </div>

        {/* Diary list */}
        {diary.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">还没有写日记</p>
          </div>
        ) : (
          <div className="space-y-4">
            {diary.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-serif font-bold">
                        {item.title}
                      </h3>
                      {item.mood && (
                        <span className="text-xl">{item.mood}</span>
                      )}
                      {item.weather && <span>{item.weather}</span>}
                    </div>
                    <p className="text-gray-600 line-clamp-2 mb-3">
                      {item.content}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(item.createdAt).toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                      {item.cat && <span>{item.cat.name}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-primary-500"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-red-500"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif font-bold">
                  {editingItem ? '编辑日记' : '写日记'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    标题
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="日记标题"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    内容
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 h-32 resize-none"
                    placeholder="记录今天的趣事..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      心情
                    </label>
                    <div className="flex gap-2">
                      {moodOptions.map((mood) => (
                        <button
                          key={mood}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              mood: formData.mood === mood ? '' : mood,
                            })
                          }
                          className={`text-2xl p-2 rounded-lg transition-colors ${
                            formData.mood === mood
                              ? 'bg-primary-100 ring-2 ring-primary-500'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          {mood}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      天气
                    </label>
                    <div className="flex gap-2">
                      {weatherOptions.map((weather) => (
                        <button
                          key={weather}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              weather:
                                formData.weather === weather ? '' : weather,
                            })
                          }
                          className={`text-2xl p-2 rounded-lg transition-colors ${
                            formData.weather === weather
                              ? 'bg-primary-100 ring-2 ring-primary-500'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          {weather}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    关联猫咪
                  </label>
                  <select
                    value={formData.catId}
                    onChange={(e) =>
                      setFormData({ ...formData, catId: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">不关联</option>
                    {cats.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
                  >
                    {editingItem ? '保存' : '发布'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
