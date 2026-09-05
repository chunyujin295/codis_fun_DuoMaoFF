import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const media = await prisma.media.findUnique({
      where: { id: params.id },
      include: { cat: true },
    })

    if (!media) {
      return NextResponse.json({ success: false, error: 'Media not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: media })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch media' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Delete file from filesystem
    const media = await prisma.media.findUnique({ where: { id: params.id } })
    if (media) {
      const fs = require('fs')
      const path = require('path')
      const filePath = path.join(process.cwd(), media.filePath)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    }

    await prisma.media.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete media' }, { status: 500 })
  }
}
