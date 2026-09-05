'use client'

import { apiFetch } from '@/lib/urls'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Image as ImageIcon, BookOpen, Cat, TrendingUp } from 'lucide-react'

interface Stats {
  mediaCount: number
  diaryCount: number
  catCount: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    mediaCount: 0,
    diaryCount: 0,
    catCount: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      apiFetch('/api/media?pageSize=1').then((res) => res.json()),
      apiFetch('/api/diary?pageSize=1').then((res) => res.json()),
      apiFetch('/api/cats').then((res) => res.json()),
    ]).then(([mediaRes, diaryRes, catsRes]) => {
      setStats({
        mediaCount: mediaRes.data?.total || 0,
        diaryCount: diaryRes.data?.total || 0,
        catCount: catsRes.data?.length || 0,
      })
      setLoading(false)
    })
  }, [])

  const statCards = [
    {
      label: '照片/视频',
      value: stats.mediaCount,
      icon: ImageIcon,
      color: 'primary',
      href: '/admin/media',
    },
    {
      label: '日记',
      value: stats.diaryCount,
      icon: BookOpen,
      color: 'secondary',
      href: '/admin/diary',
    },
    {
      label: '猫咪',
      value: stats.catCount,
      icon: Cat,
      color: 'accent',
      href: '/admin',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <TrendingUp className="w-8 h-8 text-primary-500" />
        </motion.div>
      </div>
    )
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-serif font-bold mb-8">仪表板</h1>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statCards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={card.href}>
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">{card.label}</p>
                      <p className="text-3xl font-bold mt-1">{card.value}</p>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-xl bg-${card.color}-50 flex items-center justify-center`}
                    >
                      <card.icon className={`w-6 h-6 text-${card.color}-500`} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-serif font-bold mb-4">快捷操作</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/admin/media"
              className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <p className="font-medium">上传照片/视频</p>
                <p className="text-sm text-gray-500">添加新的媒体内容</p>
              </div>
            </Link>
            <Link
              href="/admin/diary"
              className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary-50 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-secondary-500" />
              </div>
              <div>
                <p className="font-medium">写日记</p>
                <p className="text-sm text-gray-500">记录猫咪的日常</p>
              </div>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
