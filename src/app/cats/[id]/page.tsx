'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Cat, ArrowLeft, Sparkles, Calendar, Palette, Image, BookOpen } from 'lucide-react'

interface CatDetail {
  id: string
  name: string
  description?: string | null
  personality?: string | null
  color?: string | null
  avatar?: string | null
  birthday?: string | null
  media?: Array<{
    id: string
    filename: string
    filePath: string
    type: string
    createdAt: string
  }>
  diary?: Array<{
    id: string
    title: string
    content: string
    mood?: string | null
    createdAt: string
  }>
  _count?: {
    media: number
    diary: number
  }
}

export default function CatDetailPage({ params }: { params: { id: string } }) {
  const [cat, setCat] = useState<CatDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/cats/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCat(data.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Cat className="w-12 h-12 text-primary-500" />
        </motion.div>
      </div>
    )
  }

  if (!cat) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Cat className="w-16 h-16 text-gray-300" />
        <p className="text-gray-500">找不到这只猫咪</p>
        <Link href="/cats" className="text-primary-500 hover:text-primary-600">
          返回猫咪列表
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Back button */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Link
          href="/cats"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回</span>
        </Link>
      </div>

      {/* Hero section */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="aspect-square bg-gradient-to-br from-primary-100 via-secondary-50 to-accent-100 rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Cat className="w-48 h-48 text-primary-300" />
              </motion.div>
            </div>
            
            {/* Floating badge */}
            <motion.div
              className="absolute -bottom-4 -right-4 bg-white px-6 py-3 rounded-full shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              <span className="text-2xl">🐱</span>
            </motion.div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-4xl md:text-5xl font-serif font-bold">{cat.name}</h1>
              {cat.color && (
                <span className="px-4 py-1 bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-600 text-sm rounded-full border border-primary-100">
                  {cat.color}
                </span>
              )}
            </div>

            {cat.personality && (
              <div className="flex items-center gap-2 mb-6 text-gray-600">
                <Sparkles className="w-5 h-5 text-accent-500" />
                <span className="text-lg font-medium">{cat.personality}</span>
              </div>
            )}

            <div className="space-y-4 mb-8">
              {cat.birthday && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-5 h-5 text-primary-400" />
                  <span>生日: {new Date(cat.birthday).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              )}
              {cat.color && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Palette className="w-5 h-5 text-secondary-400" />
                  <span>毛色: {cat.color}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-gray-600">
                <Image className="w-5 h-5 text-accent-400" />
                <span>{cat._count?.media || 0} 张照片</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <BookOpen className="w-5 h-5 text-primary-400" />
                <span>{cat._count?.diary || 0} 篇日记</span>
              </div>
            </div>

            {cat.description && (
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h3 className="font-serif font-semibold text-lg mb-3">关于 {cat.name}</h3>
                <p className="text-gray-600 leading-relaxed">{cat.description}</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Recent media */}
      {cat.media && cat.media.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-serif font-bold mb-6">最近的照片</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cat.media.slice(0, 8).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center"
              >
                <Image className="w-8 h-8 text-gray-400" />
              </motion.div>
            ))}
          </div>
          {cat.media.length > 8 && (
            <div className="text-center mt-6">
              <Link
                href={`/gallery?catId=${cat.id}`}
                className="text-primary-500 hover:text-primary-600 font-medium"
              >
                查看全部 →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Recent diary */}
      {cat.diary && cat.diary.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-serif font-bold mb-6">最近的日记</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cat.diary.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/diary/${item.id}`}>
                  <div className="bg-white rounded-2xl p-6 shadow-md card-hover h-full">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-serif font-semibold">{item.title}</h3>
                      {item.mood && <span className="text-xl">{item.mood}</span>}
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-3">{item.content}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
