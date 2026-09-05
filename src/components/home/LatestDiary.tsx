'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { BookOpen, ArrowRight, Smile } from 'lucide-react'

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

export function LatestDiary({ diary }: { diary: DiaryItem[] }) {
  if (diary.length === 0) {
    return null
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            小猫日记
          </h2>
          <p className="text-gray-500">记录它们的日常趣事和成长点滴</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diary.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/diary/${item.id}`}>
                <div className="group bg-white rounded-2xl p-6 shadow-md card-hover h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary-500" />
                      {item.cat && (
                        <span className="text-sm text-gray-500">{item.cat.name}的日记</span>
                      )}
                    </div>
                    {item.mood && (
                      <span className="text-2xl">{item.mood}</span>
                    )}
                  </div>

                  <h3 className="text-lg font-serif font-bold mb-2 group-hover:text-primary-500 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {item.content}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>
                      {new Date(item.createdAt).toLocaleDateString('zh-CN')}
                    </span>
                    {item.weather && <span>{item.weather}</span>}
                  </div>
                </div>
              </Link>
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
            href="/diary"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors border border-gray-200"
          >
            查看全部日记
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
