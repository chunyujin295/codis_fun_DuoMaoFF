import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const cats = await prisma.cat.findMany({
      include: {
        _count: {
          select: { media: true, diary: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json({ success: true, data: cats })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch cats' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const cat = await prisma.cat.create({
      data: {
        name: body.name,
        birthday: body.birthday ? new Date(body.birthday) : null,
        description: body.description,
        personality: body.personality,
        avatar: body.avatar,
        color: body.color,
      },
    })
    return NextResponse.json({ success: true, data: cat }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create cat' }, { status: 500 })
  }
}
