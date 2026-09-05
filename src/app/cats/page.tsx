'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Cat, Sparkles, Heart } from 'lucide-react'

interface CatData {
  id: string
  name: string
  description?: string | null
  personality?: string | null
  color?: string | null
  avatar?: string | null
  birthday?: string | null
  _count?: {
    media: number
    diary: number
  }
}

export default function CatsPage() {
  const [cats, setCats] = useState<CatData[]>([])

  useEffect(() => {
    fetch('/api/cats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCats(data.data)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            认识我们的小天使
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            两只性格迥异却同样可爱的小猫，用它们的方式温暖着我们的生活
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {cats.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Link href={`/cats/${cat.id}`}>
                <div className="group relative bg-white rounded-3xl overflow-hidden shadow-xl card-hover">
                  {/* Avatar section */}
                  <div className="relative h-80 bg-gradient-to-br from-primary-100 via-secondary-50 to-accent-100 flex items-center justify-center overflow-hidden">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Cat className="w-40 h-40 text-primary-300" />
                    </motion.div>
                    
                    {/* Floating decorations */}
                    <motion.div
                      className="absolute top-8 right-8"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Heart className="w-6 h-6 text-primary-400 fill-primary-400 opacity-60" />
                    </motion.div>
                    <motion.div
                      className="absolute bottom-8 left-8"
                      animate={{ y: [0, 10, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Sparkles className="w-5 h-5 text-accent-400 opacity-60" />
                    </motion.div>
                  </div>

                  {/* Info section */}
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <h2 className="text-3xl font-serif font-bold">{cat.name}</h2>
                      {cat.color && (
                        <span className="px-4 py-1 bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-600 text-sm rounded-full border border-primary-100">
                          {cat.color}
                        </span>
                      )}
                    </div>

                    {cat.personality && (
                      <div className="flex items-center gap-2 mb-4 text-gray-600">
                        <Sparkles className="w-5 h-5 text-accent-500" />
                        <span className="font-medium">{cat.personality}</span>
                      </div>
                    )}

                    {cat.birthday && (
                      <p className="text-sm text-gray-400 mb-4">
                        生日: {new Date(cat.birthday).toLocaleDateString('zh-CN')}
                      </p>
                    )}

                    {cat.description && (
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {cat.description}
                      </p>
                    )}

                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-gray-700">{cat._count?.media || 0}</span>
                        <span>张照片</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-gray-700">{cat._count?.diary || 0}</span>
                        <span>篇日记</span>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center text-primary-500 font-medium group-hover:gap-3 gap-2 transition-all">
                      <span>查看详细资料</span>
                      <span className="group-hover:translate-x-2 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
