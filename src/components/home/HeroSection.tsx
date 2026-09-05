'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Cat, ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -right-20 w-64 h-64 bg-primary-100 rounded-full opacity-50"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 w-96 h-96 bg-secondary-100 rounded-full opacity-50"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, -5, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-accent-100 rounded-full opacity-40"
          animate={{
            y: [0, -20, 0],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Cat className="w-20 h-20 mx-auto mb-6 text-primary-500" />
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
            <span className="gradient-text">双猫记</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 font-light">
            记录<span className="font-semibold text-primary-500">多多</span>和
            <span className="font-semibold text-secondary-500">毛毛</span>的每一个美好瞬间
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/gallery"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 text-white rounded-full font-medium hover:bg-primary-600 transition-colors shadow-lg hover:shadow-xl"
          >
            浏览相册
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/cats"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors border border-gray-200"
          >
            认识它们
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-1.5 bg-gray-400 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
