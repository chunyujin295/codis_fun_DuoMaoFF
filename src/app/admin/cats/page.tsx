'use client'

import { apiFetch, siteUrl } from '@/lib/urls'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Cat,
  Plus,
  Edit2,
  Trash2,
  X,
  Calendar,
  Palette,
  Heart,
} from 'lucide-react'

interface CatItem {
  id: string
  name: string
  description?: string | null
  personality?: string | null
  color?: string | null
  avatar?: string | null
  birthday?: string | null
  createdAt: string
  _count: { media: number; diary: number }
}

interface MediaItem {
  id: string
  filePath: string
  thumbnailPath?: string | null
  originalName: string
}

export default function CatsManagementPage() {
  const [cats, setCats] = useState<CatItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<CatItem | null>(null)
  const [catMedia, setCatMedia] = useState<MediaItem[]>([])
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    personality: '',
    color: '',
    birthday: '',
    avatar: '',
  })

  useEffect(() => {
    apiFetch('/api/cats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCats(data.data)
        setLoading(false)
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const data = {
      ...formData,
      birthday: formData.birthday || null,
      avatar: formData.avatar || null,
    }

    try {
      if (editingItem) {
        const res = await apiFetch(`/api/cats/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        const result = await res.json()
        if (result.success) {
          setCats((prev) =>
            prev.map((item) =>
              item.id === editingItem.id ? { ...item, ...result.data } : item
            )
          )
        }
      } else {
        const res = await apiFetch('/api/cats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        const result = await res.json()
        if (result.success) {
          setCats((prev) => [
            { ...result.data, _count: { media: 0, diary: 0 } },
            ...prev,
          ])
        }
      }
    } catch (error) {
      console.error('Save failed:', error)
    }

    setShowModal(false)
    setEditingItem(null)
    setFormData({
      name: '',
      description: '',
      personality: '',
      color: '',
      birthday: '',
      avatar: '',
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这只猫咪吗？相关照片和日记将取消关联。')) return

    try {
      const res = await apiFetch(`/api/cats/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setCats((prev) => prev.filter((item) => item.id !== id))
      }
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const openEditModal = async (item: CatItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      description: item.description || '',
      personality: item.personality || '',
      color: item.color || '',
      birthday: item.birthday
        ? new Date(item.birthday).toISOString().split('T')[0]
        : '',
      avatar: item.avatar || '',
    })
    setShowModal(true)

    try {
      const res = await apiFetch(`/api/cats/${item.id}`)
      const data = await res.json()
      if (data.success && data.data.media) {
        setCatMedia(
          data.data.media.map((m: any) => ({
            id: m.id,
            filePath: m.filePath,
            thumbnailPath: m.thumbnailPath,
            originalName: m.originalName,
          }))
        )
      }
    } catch {
      setCatMedia([])
    }
  }

  const openCreateModal = () => {
    setEditingItem(null)
    setFormData({
      name: '',
      description: '',
      personality: '',
      color: '',
      birthday: '',
      avatar: '',
    })
    setCatMedia([])
    setShowModal(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Cat className="w-8 h-8 text-primary-500" />
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
          <h1 className="text-3xl font-serif font-bold">猫咪管理</h1>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            添加猫咪
          </button>
        </div>

        {cats.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl">
            <Cat className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">还没有添加猫咪</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cats.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.avatar ? (
                      <img
                        src={siteUrl(item.avatar)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Cat className="w-10 h-10" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-serif font-bold truncate">
                        {item.name}
                      </h3>
                      {item.color && (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                          <Palette className="w-3 h-3" />
                          {item.color}
                        </span>
                      )}
                    </div>
                    {item.personality && (
                      <p className="text-sm text-gray-500 mb-1 line-clamp-1">
                        <Heart className="w-3 h-3 inline mr-1" />
                        {item.personality}
                      </p>
                    )}
                    {item.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>{item._count.media} 张照片</span>
                      <span>{item._count.diary} 篇日记</span>
                      {item.birthday && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.birthday).toLocaleDateString('zh-CN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => openEditModal(item)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-primary-500 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-red-500 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    删除
                  </button>
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
              className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif font-bold">
                  {editingItem ? '编辑猫咪' : '添加猫咪'}
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
                    名字 *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="猫咪的名字"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    毛色
                  </label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="比如：橘白、重点色"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    性格
                  </label>
                  <input
                    type="text"
                    value={formData.personality}
                    onChange={(e) =>
                      setFormData({ ...formData, personality: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="比如：活泼、温柔、爱撒娇"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    介绍
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 h-24 resize-none"
                    placeholder="关于这只猫咪的故事..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    生日
                  </label>
                  <input
                    type="date"
                    value={formData.birthday}
                    onChange={(e) =>
                      setFormData({ ...formData, birthday: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    头像
                  </label>
                  {formData.avatar ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={siteUrl(formData.avatar)}
                        alt="头像预览"
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, avatar: '' })
                        }
                        className="text-sm text-red-500 hover:text-red-600"
                      >
                        移除头像
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowAvatarPicker(true)}
                      className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-primary-400 hover:text-primary-500 transition-colors"
                    >
                      从已有照片中选择头像
                    </button>
                  )}
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
                    {editingItem ? '保存' : '添加'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar Picker Modal */}
      <AnimatePresence>
        {showAvatarPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
            onClick={() => setShowAvatarPicker(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-serif font-bold">选择头像</h3>
                <button
                  onClick={() => setShowAvatarPicker(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {catMedia.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  暂无照片，请先上传照片
                </p>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {catMedia.map((media) => (
                    <button
                      key={media.id}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, avatar: media.filePath })
                        setShowAvatarPicker(false)
                      }}
                      className={`aspect-square rounded-xl overflow-hidden border-2 transition-colors ${
                        formData.avatar === media.filePath
                          ? 'border-primary-500 ring-2 ring-primary-200'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={siteUrl(media.thumbnailPath || media.filePath)}
                        alt={media.originalName}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
