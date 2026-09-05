import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { storedFilePath } from '@/lib/storage'
import { unlink } from 'fs/promises'
import path from 'path'

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
      return NextResponse.json(
        { success: false, error: 'Media not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: media })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch media' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!(await getServerSession(authOptions))) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      )
    }
    // Delete file from filesystem
    const media = await prisma.media.findUnique({ where: { id: params.id } })
    if (!media)
      return NextResponse.json(
        { success: false, error: '文件不存在' },
        { status: 404 }
      )

    await prisma.media.delete({
      where: { id: params.id },
    })

    // Remove the index first so a failed database write never destroys a referenced original.
    const files = [media.filePath, media.thumbnailPath].filter(
      (value): value is string => Boolean(value)
    )
    await Promise.all(
      files.map((value) =>
        unlink(storedFilePath(path.basename(value))).catch((error) => {
          if (error.code !== 'ENOENT')
            console.error('Unreferenced media cleanup failed:', error)
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete media' },
      { status: 500 }
    )
  }
}
