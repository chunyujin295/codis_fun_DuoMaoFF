'use client'

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
  const [cats, setCats] = useState<Cat[]>([])
  const [media, setMedia] = useState<Media[]>([])
  const [diary, setDiary] = useState<Diary[]>([])

  useEffect(() => {
    // Fetch data
    Promise.all([
      fetch('/api/cats').then((res) => res.json()),
      fetch('/api/media?pageSize=8').then((res) => res.json()),
      fetch('/api/diary?pageSize=3').then((res) => res.json()),
    ]).then(([catsRes, mediaRes, diaryRes]) => {
      if (catsRes.success) setCats(catsRes.data)
      if (mediaRes.success) setMedia(mediaRes.data.items)
      if (diaryRes.success) setDiary(diaryRes.data.items)
    })
  }, [])

  return (
    <div>
      <HeroSection />
      <FeaturedCats cats={cats} />
      <LatestMedia media={media} />
      <LatestDiary diary={diary} />
    </div>
  )
}
