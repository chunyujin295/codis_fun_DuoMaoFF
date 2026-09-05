'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Cat, Heart, Sparkles } from 'lucide-react'

interface CatCardProps {
  id: string
  name: string
  description?: string | null
  personality?: string | null
  color?: string | null
  avatar?: string | null
}

export function FeaturedCats({ cats }: { cats: CatCardProps[] }) {
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
            认识我们的小天使
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            两只性格迥异却同样可爱的小猫，用它们的方式温暖着我们的生活
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cats.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Link href={`/cats/${cat.id}`}>
                <div className="group relative bg-white rounded-3xl overflow-hidden shadow-lg card-hover">
                  {/* Avatar placeholder with gradient */}
                  <div className="relative h-64 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                    <Cat className="w-32 h-32 text-primary-300 group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute top-4 right-4">
                      <Heart className="w-6 h-6 text-primary-400 fill-primary-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-2xl font-serif font-bold">{cat.name}</h3>
                      {cat.color && (
                        <span className="px-3 py-1 bg-primary-50 text-primary-600 text-xs rounded-full">
                          {cat.color}
                        </span>
                      )}
                    </div>
                    
                    {cat.personality && (
                      <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                        <Sparkles className="w-4 h-4 text-accent-500" />
                        <span>{cat.personality}</span>
                      </div>
                    )}

                    {cat.description && (
                      <p className="text-gray-600 line-clamp-2">{cat.description}</p>
                    )}

                    <div className="mt-4 flex items-center text-primary-500 font-medium group-hover:gap-3 gap-2 transition-all">
                      <span>了解更多</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
