'use client'

import { apiFetch } from '@/lib/urls'

import { useEffect, useState } from 'react'
import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedCats } from '@/components/home/FeaturedCats'
import { LatestMedia } from '@/components/home/LatestMedia'
import { LatestDiary } from '@/components/home/LatestDiary'

interface Cat {
  id: string
  name: string
  description?: string | null
  personality?: string | null
  color?: string | null
  avatar?: string | null
}

interface Media {
  id: string
  filename: string
  filePath: string
  type: 'image' | 'video'
  description?: string | null
  createdAt: string
}

interface Diary {
  id: string
  title: string
  content: string
  mood?: string | null
  weather?: string | null
  cat?: { name: string } | null
  createdAt: string
}

export default function HomePage() {
  const [error, setError] = useState('')
  const [cats, setCats] = useState<Cat[]>([])
  const [media, setMedia] = useState<Media[]>([])
  const [diary, setDiary] = useState<Diary[]>([])

  useEffect(() => {
    // Fetch data
    Promise.all([
      apiFetch('/api/cats').then((res) => res.json()),
      apiFetch('/api/media?pageSize=8').then((res) => res.json()),
      apiFetch('/api/diary?pageSize=3').then((res) => res.json()),
    ])
      .then(([catsRes, mediaRes, diaryRes]) => {
        if (catsRes.success) setCats(catsRes.data)
        if (mediaRes.success) setMedia(mediaRes.data.items)
        if (diaryRes.success) setDiary(diaryRes.data.items)
      })
      .catch(() => setError('暂时无法读取收藏，请稍后刷新。'))
  }, [])

  return (
    <div>
      <HeroSection media={media} />
      {error && (
        <div className="error-banner mx-[5%]" role="alert">
          {error}
        </div>
      )}
      <FeaturedCats cats={cats} />
      <LatestMedia media={media} />
      <LatestDiary diary={diary} />
    </div>
  )
}
