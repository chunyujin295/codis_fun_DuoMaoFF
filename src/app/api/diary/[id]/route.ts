import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const diary = await prisma.diary.findUnique({
      where: { id: params.id },
      include: {
        cat: true,
        media: {
          include: { media: true },
        },
      },
    })

    if (!diary) {
      return NextResponse.json({ success: false, error: 'Diary not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: diary })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch diary' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const diary = await prisma.diary.update({
      where: { id: params.id },
      data: {
        title: body.title,
        content: body.content,
        mood: body.mood,
        weather: body.weather,
        catId: body.catId,
      },
      include: { cat: true },
    })
    return NextResponse.json({ success: true, data: diary })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update diary' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.diary.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete diary' }, { status: 500 })
  }
}
