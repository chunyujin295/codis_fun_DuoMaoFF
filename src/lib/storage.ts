import path from 'path'

export function uploadDirectory() {
  return path.resolve(
    process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads')
  )
}

export function storedFilePath(filename: string) {
  if (
    !/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(filename) ||
    filename.includes('..')
  ) {
    throw new Error('Invalid storage filename')
  }
  return path.join(uploadDirectory(), filename)
}

export const mediaTypes: Record<
  string,
  { mime: string; type: 'image' | 'video' }
> = {
  jpg: { mime: 'image/jpeg', type: 'image' },
  jpeg: { mime: 'image/jpeg', type: 'image' },
  png: { mime: 'image/png', type: 'image' },
  gif: { mime: 'image/gif', type: 'image' },
  webp: { mime: 'image/webp', type: 'image' },
  mp4: { mime: 'video/mp4', type: 'video' },
  webm: { mime: 'video/webm', type: 'video' },
  mov: { mime: 'video/quicktime', type: 'video' },
}

// A single byte range is sufficient for browser video seeking.
export function parseByteRange(
  header: string,
  size: number
): { start: number; end: number } | null {
  const match = /^bytes=(\d*)-(\d*)$/.exec(header)
  if (!match || (!match[1] && !match[2]) || size <= 0) return null
  let start: number
  let end: number
  if (!match[1]) {
    const suffix = Number(match[2])
    if (!Number.isSafeInteger(suffix) || suffix <= 0) return null
    start = Math.max(0, size - suffix)
    end = size - 1
  } else {
    start = Number(match[1])
    end = match[2] ? Number(match[2]) : size - 1
    if (
      !Number.isSafeInteger(start) ||
      !Number.isSafeInteger(end) ||
      start >= size ||
      start > end
    )
      return null
    end = Math.min(end, size - 1)
  }
  return { start, end }
}
