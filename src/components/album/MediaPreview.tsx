'use client'
import { useState } from 'react'
import { Play, ImageOff } from 'lucide-react'
import { siteUrl } from '@/lib/urls'

export interface AlbumMedia {
  id: string
  filePath: string
  thumbnailPath?: string | null
  type: string
  description?: string | null
  originalName?: string
  cat?: { name: string } | null
  createdAt?: string
  dateTaken?: string | null
}
export function MediaPreview({
  item,
  full = false,
  className = '',
}: {
  item: AlbumMedia
  full?: boolean
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  if (failed)
    return (
      <div className={'media-unavailable ' + className}>
        <ImageOff size={24} />
        <span>文件暂时无法读取</span>
        {full && item.type === 'video' && <a href={siteUrl(item.filePath)} download className="underline">下载原视频</a>}
      </div>
    )
  if (item.type === 'video')
    return (
      <div className={'video-preview ' + className}>
        <video
          src={siteUrl(item.filePath)}
          controls={full}
          playsInline
          preload={full ? 'metadata' : 'none'}
          onError={() => setFailed(true)}
          className={full ? 'media-full' : 'media-cover'}
        />
        {!full && (
          <span className="video-label">
            <Play size={22} fill="currentColor" />
            小小放映室
          </span>
        )}
        {full && (
          <a className="video-download" href={siteUrl(item.filePath)} download>
            无法播放？下载原视频
          </a>
        )}
      </div>
    )
  // Stored media is served by our authenticated-write/public-read route, not a remote image optimizer.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={siteUrl(full ? item.filePath : item.thumbnailPath || item.filePath)}
      alt={item.description || item.originalName || '猫咪生活照片'}
      loading={full ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      className={(full ? 'media-full ' : 'media-cover ') + className}
    />
  )
}
