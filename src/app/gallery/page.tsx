'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Image, Video, Filter } from 'lucide-react'
import { Lightbox } from '@/components/gallery/Lightbox'

interface MediaItem {
  id: string
  filename: string
  filePath: string
  type: 'image' | 'video'
  description?: string | null
  dateTaken?: string | null
  catId?: string | null
  createdAt: string
  cat?: {
    id: string
    name: string
  } | null
}

interface Cat {
  id: string
  name: string
}

export default function GalleryPage() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [cats, setCats] = useState<Cat[]>([])
  const [selectedCat, setSelectedCat] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/cats').then((res) => res.json()),
      fetch('/api/media?pageSize=100').then((res) => res.json()),
    ]).then(([catsRes, mediaRes]) => {
      if (catsRes.success) setCats(catsRes.data)
      if (mediaRes.success) setMedia(mediaRes.data.items)
      setLoading(false)
    })
  }, [])

  const filteredMedia = selectedCat
    ? media.filter((item) => item.catId === selectedCat)
    : media

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Image className="w-12 h-12 text-primary-500" />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            精选相册
          </h1>
          <p className="text-gray-500 text-lg">
            用镜头记录的每一个美好时刻
          </p>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-12"
        >
          <button
            onClick={() => setSelectedCat(null)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCat === null
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Filter className="w-4 h-4 inline mr-1" />
            全部
          </button>
          {cats.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCat === cat.id
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </motion.div>

        {/* Masonry grid */}
        {filteredMedia.length === 0 ? (
          <div className="text-center py-20">
            <Image className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">还没有上传任何照片</p>
          </div>
        ) : (
          <div className="masonry-grid">
            {filteredMedia.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="masonry-item"
              >
                <div
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-md card-hover cursor-pointer"
                  onClick={() => setLightboxIndex(index)}
                >
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    {item.type === 'video' ? (
                      <Video className="w-12 h-12 text-gray-400" />
                    ) : (
                      <Image className="w-12 h-12 text-gray-400" />
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors">
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white/90 px-4 py-2 rounded-full">
                          <Image className="w-5 h-5 text-gray-700 inline mr-1" />
                          <span className="text-sm font-medium text-gray-700">查看</span>
                        </div>
                      </div>
                    </div>

                    {/* Video badge */}
                    {item.type === 'video' && (
                      <div className="absolute top-3 right-3 bg-black/60 px-2 py-1 rounded-full">
                        <Video className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        {new Date(item.dateTaken || item.createdAt).toLocaleDateString('zh-CN')}
                      </p>
                      {item.cat && (
                        <span className="text-xs px-2 py-1 bg-primary-50 text-primary-600 rounded-full">
                          {item.cat.name}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          items={filteredMedia}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  )
}
