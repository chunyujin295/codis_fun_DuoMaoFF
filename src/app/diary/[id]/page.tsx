'use client'

import { apiFetch } from '@/lib/urls'
import { MediaPreview } from '@/components/album/MediaPreview'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Calendar, Image, Video } from 'lucide-react'

interface DiaryDetail {
  id: string
  title: string
  content: string
  mood?: string | null
  weather?: string | null
  cat?: {
    id: string
    name: string
  } | null
  media?: Array<{
    media: {
      id: string
      filePath: string
      type: string
    }
  }>
  createdAt: string
}

export default function DiaryDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const [diary, setDiary] = useState<DiaryDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch(`/api/diary/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setDiary(data.data)
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
          <BookOpen className="w-12 h-12 text-primary-500" />
        </motion.div>
      </div>
    )
  }

  if (!diary) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <BookOpen className="w-16 h-16 text-gray-300" />
        <p className="text-gray-500">找不到这篇日记</p>
        <Link href="/diary" className="text-primary-500 hover:text-primary-600">
          返回日记列表
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/50 to-white py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/diary"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回日记列表</span>
          </Link>
        </motion.div>

        {/* Diary content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-lg"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">
                {diary.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(diary.createdAt).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                {diary.cat && (
                  <Link
                    href={`/cats/${diary.cat.id}`}
                    className="text-primary-500 hover:text-primary-600"
                  >
                    {diary.cat.name}
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {diary.mood && <span className="text-4xl">{diary.mood}</span>}
              {diary.weather && (
                <span className="text-2xl">{diary.weather}</span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {diary.content.split('\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Media attachments */}
          {diary.media && diary.media.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h3 className="font-serif font-semibold mb-4">附件</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {diary.media.map((item) => (
                  <div
                    key={item.media.id}
                    className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center"
                  >
                    <MediaPreview item={item.media} full />
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.article>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <Link
            href="/diary"
            className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            查看更多日记
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
