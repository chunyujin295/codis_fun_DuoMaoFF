import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const catId = searchParams.get('catId')
    const type = searchParams.get('type')
    const page = Math.max(1, Number(searchParams.get('page')) || 1)
    const pageSize = Math.min(
      100,
      Math.max(1, Number(searchParams.get('pageSize')) || 24)
    )
    if (!Number.isSafeInteger(page) || !Number.isSafeInteger(pageSize)) {
      return NextResponse.json(
        { success: false, error: '分页参数无效' },
        { status: 400 }
      )
    }

    const where: any = {}
    if (catId) where.catId = catId
    if (type) where.type = type

    const [items, total] = await Promise.all([
      prisma.media.findMany({
        where,
        include: { cat: true },
        orderBy: [{ dateTaken: 'desc' }, { id: 'desc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.media.count({ where }),
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
    return NextResponse.json(
      { success: false, error: 'Failed to fetch media' },
      { status: 500 }
    )
  }
}
