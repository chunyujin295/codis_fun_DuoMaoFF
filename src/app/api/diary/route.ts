import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const catId = searchParams.get('catId')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')

    const where: any = {}
    if (catId) where.catId = catId

    const [items, total] = await Promise.all([
      prisma.diary.findMany({
        where,
        include: {
          cat: true,
          media: {
            include: { media: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.diary.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch diary' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const diary = await prisma.diary.create({
      data: {
        title: body.title,
        content: body.content,
        mood: body.mood,
        weather: body.weather,
        catId: body.catId,
      },
      include: { cat: true },
    })
    return NextResponse.json({ success: true, data: diary }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create diary' }, { status: 500 })
  }
}
