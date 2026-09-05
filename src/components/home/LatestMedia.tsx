'use client'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import { MediaPreview, AlbumMedia } from '@/components/album/MediaPreview'
import { Lightbox } from '@/components/gallery/Lightbox'
export function LatestMedia({ media }: { media: AlbumMedia[] }) {
  const [index, setIndex] = useState<number | null>(null)
  return (
    <section className="album-section moments-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">02 / COLLECTED MOMENTS</span>
          <h2>
            舍不得删掉的
            <span className="handwritten">这一张，还有这一张。</span>
          </h2>
        </div>
        <Link href="/gallery">
          打开影像抽屉 <ArrowUpRight size={17} />
        </Link>
      </div>
      {media.length ? (
        <div className="moments-grid">
          {media.slice(0, 4).map((item, i) => (
            <button
              key={item.id}
              className="moment-card"
              onClick={() => setIndex(i)}
              aria-label={'查看' + (item.description || '收藏影像')}
            >
              <div className="moment-image">
                <MediaPreview item={item} />
              </div>
              <div className="moment-caption">
                <span>
                  {item.description ||
                    (item.type === 'video'
                      ? '会动的小日子'
                      : '普通日子，珍贵存档')}
                </span>
                <small>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString('zh-CN')
                    : ''}
                </small>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="paper-empty">
          <span className="handwritten">这里，留给第一张舍不得删的照片。</span>
          <Link href="/admin/media">收藏第一个瞬间 ↗</Link>
        </div>
      )}
      {index !== null && (
        <Lightbox
          items={media.slice(0, 4)}
          currentIndex={index}
          onClose={() => setIndex(null)}
          onNavigate={setIndex}
        />
      )}
    </section>
  )
}
