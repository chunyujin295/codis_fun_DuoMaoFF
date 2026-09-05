'use client'

import { apiFetch } from '@/lib/urls'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { BookOpen, ArrowRight, Calendar, Cloud } from 'lucide-react'

interface DiaryItem {
  id: string
  title: string
  content: string
  mood?: string | null
  weather?: string | null
  cat?: {
    name: string
  } | null
  createdAt: string
}

export default function DiaryPage() {
  const [diary, setDiary] = useState<DiaryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch('/api/diary?pageSize=20')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setDiary(data.data.items)
        setLoading(false)
      })
  }, [])

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/50 to-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="collection-heading"
        >
          <div>
            <span className="eyebrow">NOTES TO KEEP / 私人手记</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              铲屎官的碎碎念
            </h1>
            <p className="text-gray-500 text-lg">
              不是什么大事，但想一直记得。
            </p>
          </div>
        </motion.div>

        {diary.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">还没有写日记</p>
          </div>
        ) : (
          <div className="space-y-6">
            {diary.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/diary/${item.id}`}>
                  <div className="note-card group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-primary-500" />
                        </div>
                        <div>
                          <h2 className="text-xl font-serif font-bold group-hover:text-primary-500 transition-colors">
                            {item.title}
                          </h2>
                          {item.cat && (
                            <p className="text-sm text-gray-400">
                              {item.cat.name}的日记
                            </p>
                          )}
                        </div>
                      </div>
                      {item.mood && (
                        <span className="text-3xl">{item.mood}</span>
                      )}
                    </div>

                    <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                      {item.content}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(item.createdAt).toLocaleDateString(
                              'zh-CN',
                              {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              }
                            )}
                          </span>
                        </div>
                        {item.weather && (
                          <div className="flex items-center gap-1">
                            <span>{item.weather}</span>
                          </div>
                        )}
                      </div>
                      <span className="text-primary-500 group-hover:translate-x-1 transition-transform">
                        阅读全文 →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
