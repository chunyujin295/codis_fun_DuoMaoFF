import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { extractExifData } from '@/lib/exif'
import { generateUniqueFilename, isImageFile, isVideoFile } from '@/lib/utils'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const catId = formData.get('catId') as string | null
    const description = formData.get('description') as string | null

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    // Determine media type
    const type = isImageFile(file.name) ? 'image' : isVideoFile(file.name) ? 'video' : null
    if (!type) {
      return NextResponse.json({ success: false, error: 'Unsupported file type' }, { status: 400 })
    }

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'uploads')
    await mkdir(uploadDir, { recursive: true })

    // Generate unique filename and save file
    const filename = generateUniqueFilename(file.name)
    const filePath = path.join(uploadDir, filename)
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    // Extract EXIF data for images
    let dateTaken: Date | undefined
    let exifData: string | undefined

    if (type === 'image') {
      const exif = await extractExifData(filePath)
      dateTaken = exif.dateTaken
      exifData = exif.data ? JSON.stringify(exif.data) : undefined
    }

    // Save to database
    const media = await prisma.media.create({
      data: {
        filename,
        originalName: file.name,
        filePath: `/uploads/${filename}`,
        type,
        description,
        dateTaken: dateTaken || new Date(),
        exifData,
        catId,
      },
      include: { cat: true },
    })

    return NextResponse.json({ success: true, data: media }, { status: 201 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ success: false, error: 'Failed to upload file' }, { status: 500 })
  }
}
