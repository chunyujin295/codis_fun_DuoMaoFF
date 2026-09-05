'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image, Video, Upload, Trash2, X, Check } from 'lucide-react'

interface MediaItem {
  id: string
  filename: string
  originalName: string
  filePath: string
  type: 'image' | 'video'
  description?: string | null
  catId?: string | null
  cat?: { name: string } | null
  createdAt: string
}

interface Cat {
  id: string
  name: string
}

export default function MediaManagementPage() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [cats, setCats] = useState<Cat[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedCat, setSelectedCat] = useState<string>('')
  const [description, setDescription] = useState('')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/media?pageSize=100').then((res) => res.json()),
      fetch('/api/cats').then((res) => res.json()),
    ]).then(([mediaRes, catsRes]) => {
      if (mediaRes.success) setMedia(mediaRes.data.items)
      if (catsRes.success) setCats(catsRes.data)
      setLoading(false)
    })
  }, [])

  const handleUpload = async (files: FileList) => {
    if (files.length === 0) return

    setUploading(true)
    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append('file', file)
      if (selectedCat) formData.append('catId', selectedCat)
      if (description) formData.append('description', description)

      try {
        const res = await fetch('/api/media/upload', {
          method: 'POST',
          body: formData,
        })
        const data = await res.json()
        if (data.success) {
          setMedia((prev) => [data.data, ...prev])
        }
      } catch (error) {
        console.error('Upload failed:', error)
      }
    }
    setUploading(false)
    setShowUploadModal(false)
    setSelectedCat('')
    setDescription('')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个文件吗？')) return

    try {
      const res = await fetch(`/api/media/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setMedia((prev) => prev.filter((item) => item.id !== id))
      }
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Image className="w-8 h-8 text-primary-500" />
        </motion.div>
      </div>
    )
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif font-bold">媒体管理</h1>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
          >
            <Upload className="w-5 h-5" />
            上传
          </button>
        </div>

        {/* Media grid */}
        {media.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl">
            <Image className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">还没有上传任何媒体</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {media.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative bg-white rounded-xl overflow-hidden shadow-sm"
              >
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  {item.type === 'video' ? (
                    <Video className="w-8 h-8 text-gray-400" />
                  ) : (
                    <Image className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div className="p-2">
                  <p className="text-xs text-gray-500 truncate">{item.originalName}</p>
                  {item.cat && (
                    <p className="text-xs text-primary-500">{item.cat.name}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Upload modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif font-bold">上传媒体</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    选择猫咪
                  </label>
                  <select
                    value={selectedCat}
                    onChange={(e) => setSelectedCat(e.target.value)}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    描述
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="可选的描述"
                  />
                </div>

                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    dragActive
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600 mb-2">拖拽文件到这里</p>
                  <p className="text-sm text-gray-400 mb-4">或者</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    选择文件
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) => e.target.files && handleUpload(e.target.files)}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
