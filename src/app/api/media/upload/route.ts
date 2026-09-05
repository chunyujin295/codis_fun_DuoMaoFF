import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { randomUUID } from 'crypto'
import { mkdir, open, rename, unlink } from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { extractExifData } from '@/lib/exif'
import { mediaTypes, storedFilePath, uploadDirectory } from '@/lib/storage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await getServerSession(authOptions)))
    return NextResponse.json({ success: false }, { status: 401 })
  return NextResponse.json({
    success: true,
    maxFileSize: Number(process.env.MAX_FILE_SIZE || 52428800),
  })
}

export async function POST(request: Request) {
  const createdPaths: string[] = []
  let committed = false
  try {
    if (!(await getServerSession(authOptions))) {
      return NextResponse.json(
        { success: false, error: '请先登录管理员账号' },
        { status: 401 }
      )
    }
    const maxSize = Number(process.env.MAX_FILE_SIZE || 52428800)
    if (!Number.isSafeInteger(maxSize) || maxSize <= 0)
      throw new Error('Invalid MAX_FILE_SIZE')
    const length = Number(request.headers.get('content-length') || 0)
    if (length > maxSize + 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: '文件超过服务器上传上限' },
        { status: 413 }
      )
    }
    let received = 0
    const boundedBody = request.body?.pipeThrough(
      new TransformStream({
        transform(chunk, controller) {
          received += chunk.byteLength
          if (received > maxSize + 1024 * 1024)
            throw new RangeError('Upload too large')
          controller.enqueue(chunk)
        },
      })
    )
    const boundedRequest = new Request(request.url, {
      method: 'POST',
      headers: request.headers,
      body: boundedBody,
      duplex: 'half',
    } as RequestInit & { duplex: string })
    let formData: FormData
    try {
      formData = await boundedRequest.formData()
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            received > maxSize + 1024 * 1024
              ? '文件超过服务器上传上限'
              : '上传内容不完整，请重试',
        },
        { status: received > maxSize + 1024 * 1024 ? 413 : 400 }
      )
    }
    const file = formData.get('file')
    if (!file || typeof file === 'string' || !file.size) {
      return NextResponse.json(
        { success: false, error: '请选择非空文件' },
        { status: 400 }
      )
    }
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: '单个文件不能超过 ' + Math.round(maxSize / 1048576) + ' MB',
        },
        { status: 413 }
      )
    }
    const extension = path.extname(file.name).slice(1).toLowerCase()
    const format = mediaTypes[extension]
    if (!format)
      return NextResponse.json(
        { success: false, error: '支持 JPG、PNG、GIF、WebP、MP4、WebM 和 MOV' },
        { status: 400 }
      )
    const catId =
      typeof formData.get('catId') === 'string'
        ? String(formData.get('catId')).trim() || null
        : null
    const description =
      typeof formData.get('description') === 'string'
        ? String(formData.get('description')).slice(0, 2000)
        : null
    if (
      catId &&
      !(await prisma.cat.findUnique({
        where: { id: catId },
        select: { id: true },
      }))
    ) {
      return NextResponse.json(
        { success: false, error: '关联的猫咪不存在' },
        { status: 400 }
      )
    }
    await mkdir(uploadDirectory(), { recursive: true })
    const filename = randomUUID() + '.' + extension
    const finalPath = storedFilePath(filename)
    const temporaryPath = storedFilePath(filename + '.part')
    const handle = await open(temporaryPath, 'wx')
    createdPaths.push(temporaryPath)
    try {
      // formData buffers multipart input; avoid an additional whole-file buffer.
      const reader = file.stream().getReader()
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          let offset = 0
          while (offset < value.length) {
            const { bytesWritten } = await handle.write(
              value,
              offset,
              value.length - offset
            )
            if (bytesWritten === 0) throw new Error('Unable to write upload')
            offset += bytesWritten
          }
        }
      } finally {
        reader.releaseLock()
      }
      await handle.sync()
    } finally {
      await handle.close()
    }
    let thumbnailPath: string | undefined
    if (format.type === 'image') {
      const thumbnailName = filename + '.thumb.webp'
      const thumbnailFile = storedFilePath(thumbnailName)
      createdPaths.push(thumbnailFile)
      try {
        await sharp(temporaryPath, { limitInputPixels: 80000000 })
          .rotate()
          .resize(960, 960, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(thumbnailFile)
      } catch {
        return NextResponse.json(
          { success: false, error: '无法读取此图片，请检查文件格式或图片尺寸' },
          { status: 400 }
        )
      }
      thumbnailPath = '/uploads/' + thumbnailName
    }
    await rename(temporaryPath, finalPath)
    createdPaths.push(finalPath)
    const exif = format.type === 'image' ? await extractExifData(finalPath) : {}
    const media = await prisma.media.create({
      data: {
        filename,
        originalName: file.name,
        filePath: '/uploads/' + filename,
        thumbnailPath,
        type: format.type,
        description,
        catId,
        dateTaken: exif.dateTaken || new Date(),
        exifData: exif.data ? JSON.stringify(exif.data) : undefined,
      },
      include: { cat: true },
    })
    committed = true
    return NextResponse.json({ success: true, data: media }, { status: 201 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      {
        success: false,
        error: '保存失败，请检查服务器磁盘空间、目录权限和数据库连接后重试',
      },
      { status: 500 }
    )
  } finally {
    if (!committed) {
      await Promise.all(
        createdPaths.map((file) =>
          unlink(file).catch((error) => {
            if (error.code !== 'ENOENT')
              console.error('Upload cleanup failed:', error)
          })
        )
      )
    }
  }
}
