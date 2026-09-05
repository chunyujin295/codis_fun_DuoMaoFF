'use client'

import { apiFetch } from '@/lib/urls'
import { MediaPreview } from '@/components/album/MediaPreview'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Clock,
  Image as ImageIcon,
  Video,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

interface TimelineItem {
  id: string
  title?: string
  content?: string
  type?: string
  filePath?: string
  mood?: string | null
  timelineDate: string
  timelineType: 'media' | 'diary'
  cat?: { name: string } | null
}

interface TimelineGroup {
  year: number
  month: number
  label: string
  items: TimelineItem[]
}

export default function TimelinePage() {
  const [groups, setGroups] = useState<TimelineGroup[]>([])
  const [years, setYears] = useState<number[]>([])
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const url = selectedYear
      ? `/api/timeline?year=${selectedYear}`
      : '/api/timeline'

    apiFetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setGroups(data.data.groups)
          if (!selectedYear) setYears(data.data.years)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [selectedYear])

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(key)) {
        newSet.delete(key)
      } else {
        newSet.add(key)
      }
      return newSet
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Clock className="w-12 h-12 text-primary-500" />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="collection-heading"
        >
          <div>
            <span className="eyebrow">GROWING TOGETHER / 时间标本</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              就这样，慢慢长大
            </h1>
            <p className="text-gray-500 text-lg">
              时间走得很快，好在这些瞬间都留下了。
            </p>
          </div>
        </motion.div>

        {/* Year filter */}
        {years.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-12"
          >
            <button
              onClick={() => setSelectedYear(null)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                selectedYear === null
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              全部年份
            </button>
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedYear === year
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {year}年
              </button>
            ))}
          </motion.div>
        )}

        {/* Timeline */}
        {groups.length === 0 ? (
          <div className="text-center py-20">
            <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">还没有任何时间线数据</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-400 to-secondary-400 transform md:-translate-x-0.5" />

            {groups.map((group, groupIndex) => {
              const groupKey = `${group.year}-${group.month}`
              const isExpanded = expandedGroups.has(groupKey)

              return (
                <motion.div
                  key={groupKey}
                  initial={{ opacity: 0, x: groupIndex % 2 === 0 ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: groupIndex * 0.1 }}
                  className="relative mb-12"
                >
                  {/* Timeline node */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-primary-500 rounded-full border-4 border-white shadow transform -translate-x-1/2 z-10" />

                  {/* Group header */}
                  <div
                    className={`flex items-center cursor-pointer ${
                      groupIndex % 2 === 0
                        ? 'md:justify-start'
                        : 'md:justify-end'
                    } ml-16 md:ml-0`}
                    onClick={() => toggleGroup(groupKey)}
                  >
                    <div
                      className={`bg-white rounded-2xl px-6 py-3 shadow-md flex items-center gap-3 hover:shadow-lg transition-shadow ${
                        groupIndex % 2 === 0 ? 'md:mr-8' : 'md:ml-8'
                      }`}
                    >
                      <span className="font-serif font-bold text-lg">
                        {group.label}
                      </span>
                      <span className="text-sm text-gray-400">
                        ({group.items.length})
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Group items */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`mt-4 ml-16 md:ml-0 ${
                        groupIndex % 2 === 0 ? 'md:pr-12' : 'md:pl-12'
                      }`}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {group.items.map((item, itemIndex) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: itemIndex * 0.05 }}
                            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                          >
                            {item.timelineType === 'media' && item.filePath && (
                              <div className="aspect-video mb-4 overflow-hidden">
                                <MediaPreview
                                  item={{
                                    id: item.id,
                                    filePath: item.filePath,
                                    type: item.type || 'image',
                                  }}
                                  full={item.type === 'video'}
                                />
                              </div>
                            )}
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                                {item.timelineType === 'media' ? (
                                  item.type === 'video' ? (
                                    <Video className="w-5 h-5 text-primary-500" />
                                  ) : (
                                    <ImageIcon className="w-5 h-5 text-primary-500" />
                                  )
                                ) : (
                                  <BookOpen className="w-5 h-5 text-primary-500" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-700 truncate">
                                    {item.timelineType === 'diary'
                                      ? item.title
                                      : item.type === 'video'
                                        ? '视频'
                                        : '照片'}
                                  </span>
                                  {item.mood && <span>{item.mood}</span>}
                                </div>
                                {item.cat && (
                                  <p className="text-xs text-gray-400 mt-1">
                                    {item.cat.name}
                                  </p>
                                )}
                                {item.content && (
                                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                    {item.content}
                                  </p>
                                )}
                                <p className="text-xs text-gray-400 mt-2">
                                  {new Date(
                                    item.timelineDate
                                  ).toLocaleDateString('zh-CN')}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
