'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Image, Video, ArrowRight } from 'lucide-react'

interface MediaItem {
  id: string
  filename: string
  filePath: string
  type: 'image' | 'video'
  description?: string | null
  createdAt: string
}

export function LatestMedia({ media }: { media: MediaItem[] }) {
  if (media.length === 0) {
    return (
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <Image className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">还没有上传任何照片或视频</p>
          <Link
            href="/admin/media"
            className="inline-flex items-center gap-2 mt-4 text-primary-500 hover:text-primary-600"
          >
            上传第一个瞬间 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            最新瞬间
          </h2>
          <p className="text-gray-500">用镜头记录的每一个美好时刻</p>
        </motion.div>

        <div className="masonry-grid">
          {media.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="masonry-item"
            >
              <div className="group relative bg-white rounded-2xl overflow-hidden shadow-md card-hover">
                <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  {item.type === 'image' ? (
                    <Image className="w-12 h-12 text-gray-400" />
                  ) : (
                    <Video className="w-12 h-12 text-gray-400" />
                  )}
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.type === 'image' ? (
                        <Image className="w-8 h-8 text-white" />
                      ) : (
                        <Video className="w-8 h-8 text-white" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString('zh-CN')}
                  </p>
                  {item.description && (
                    <p className="mt-2 text-gray-700 line-clamp-2 text-sm">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors border border-gray-200"
          >
            查看全部相册
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
