import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cat = await prisma.cat.findUnique({
      where: { id: params.id },
      include: {
        media: {
          orderBy: { createdAt: 'desc' },
        },
        diary: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        _count: {
          select: { media: true, diary: true },
        },
      },
    })

    if (!cat) {
      return NextResponse.json({ success: false, error: 'Cat not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: cat })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch cat' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const cat = await prisma.cat.update({
      where: { id: params.id },
      data: {
        name: body.name,
        birthday: body.birthday ? new Date(body.birthday) : undefined,
        description: body.description,
        personality: body.personality,
        avatar: body.avatar,
        color: body.color,
      },
    })
    return NextResponse.json({ success: true, data: cat })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update cat' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.cat.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete cat' }, { status: 500 })
  }
}
