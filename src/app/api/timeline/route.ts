import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface TimelineGroup {
  [key: string]: {
    year: number
    month: number
    label: string
    items: any[]
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const catId = searchParams.get('catId')
    const year = searchParams.get('year')

    // Fetch media
    const mediaWhere: any = {}
    if (catId) mediaWhere.catId = catId

    const media = await prisma.media.findMany({
      where: mediaWhere,
      include: { cat: true },
      orderBy: { dateTaken: 'desc' },
    })

    // Fetch diary entries
    const diaryWhere: any = {}
    if (catId) diaryWhere.catId = catId

    const diary = await prisma.diary.findMany({
      where: diaryWhere,
      include: {
        cat: true,
        media: {
          include: { media: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Group by month
    const groups: TimelineGroup = {}

    // Process media
    media.forEach((item) => {
      const date = new Date(item.dateTaken || item.createdAt)
      const y = date.getFullYear()
      const m = date.getMonth() + 1

      if (year && y !== parseInt(year)) return

      const key = `${y}-${String(m).padStart(2, '0')}`
      if (!groups[key]) {
        groups[key] = {
          year: y,
          month: m,
          label: `${y}年${m}月`,
          items: [],
        }
      }
      groups[key].items.push({
        ...item,
        timelineDate: item.dateTaken || item.createdAt,
        timelineType: 'media',
      })
    })

    // Process diary
    diary.forEach((item) => {
      const date = new Date(item.createdAt)
      const y = date.getFullYear()
      const m = date.getMonth() + 1

      if (year && y !== parseInt(year)) return

      const key = `${y}-${String(m).padStart(2, '0')}`
      if (!groups[key]) {
        groups[key] = {
          year: y,
          month: m,
          label: `${y}年${m}月`,
          items: [],
        }
      }
      groups[key].items.push({
        ...item,
        timelineDate: item.createdAt,
        timelineType: 'diary',
      })
    })

    // Sort groups by date
    const sortedGroups = Object.values(groups).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year
      return b.month - a.month
    })

    // Get available years
    const years = Array.from(new Set(sortedGroups.map((g) => g.year))).sort((a, b) => b - a)

    return NextResponse.json({
      success: true,
      data: {
        groups: sortedGroups,
        years,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch timeline' }, { status: 500 })
  }
}
