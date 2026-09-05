import { open } from 'fs/promises'
import { Readable } from 'stream'
import path from 'path'
import { prisma } from '@/lib/db'
import { mediaTypes, parseByteRange, storedFilePath } from '@/lib/storage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function serve(
  request: Request,
  { params }: { params: { filename: string } }
) {
  let file
  try {
    let filePath: string
    try {
      filePath = storedFilePath(params.filename)
    } catch {
      return new Response(null, { status: 404 })
    }
    const record = await prisma.media.findFirst({
      where: {
        OR: [
          { filePath: `/uploads/${params.filename}` },
          { thumbnailPath: `/uploads/${params.filename}` },
        ],
      },
      select: { id: true },
    })
    if (!record) return new Response(null, { status: 404 })
    file = await open(filePath, 'r')
    const info = await file.stat()
    const headers = new Headers({
      'Content-Type':
        mediaTypes[path.extname(params.filename).slice(1)]?.mime ||
        'application/octet-stream',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
      'Content-Length': String(info.size),
    })
    const rangeHeader = request.headers.get('range')
    const range = rangeHeader
      ? parseByteRange(rangeHeader, info.size)
      : undefined
    if (range === null) {
      await file.close()
      return new Response(null, {
        status: 416,
        headers: { 'Content-Range': `bytes */${info.size}` },
      })
    }
    if (range) {
      headers.set(
        'Content-Range',
        `bytes ${range.start}-${range.end}/${info.size}`
      )
      headers.set('Content-Length', String(range.end - range.start + 1))
    }
    if (request.method === 'HEAD') {
      await file.close()
      return new Response(null, { status: range ? 206 : 200, headers })
    }
    const stream = file.createReadStream({ ...(range || {}), autoClose: true })
    return new Response(Readable.toWeb(stream) as ReadableStream, {
      status: range ? 206 : 200,
      headers,
    })
  } catch (error) {
    await file?.close().catch(() => {})
    if ((error as NodeJS.ErrnoException).code === 'ENOENT')
      return new Response(null, { status: 404 })
    console.error('Media read failed:', error)
    return new Response(null, { status: 500 })
  }
}

export const GET = serve
export const HEAD = serve
