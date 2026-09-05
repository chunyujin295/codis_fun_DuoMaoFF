'use client'
import { useEffect, useRef } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { AlbumMedia, MediaPreview } from '@/components/album/MediaPreview'
interface LightboxProps {
  items: AlbumMedia[]
  currentIndex: number
  onClose: () => void
  onNavigate: (index: number) => void
}
export function Lightbox({
  items,
  currentIndex,
  onClose,
  onNavigate,
}: LightboxProps) {
  const dialog = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.current?.focus()
    return () => {
      document.body.style.overflow = overflow
      previous?.focus()
    }
  }, [])
  const current = items[currentIndex]
  if (!current) return null
  const previous = () =>
    onNavigate((currentIndex - 1 + items.length) % items.length)
  const next = () => onNavigate((currentIndex + 1) % items.length)
  return (
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label="影像查看器"
      tabIndex={-1}
      className="album-lightbox"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose()
        if ((e.target as HTMLElement).tagName !== 'VIDEO') {
          if (e.key === 'ArrowLeft') previous()
          if (e.key === 'ArrowRight') next()
        }
        if (e.key === 'Tab') {
          const focusable = Array.from(
            dialog.current?.querySelectorAll<HTMLElement>(
              'button, a, video[controls]'
            ) || []
          )
          const first = focusable[0],
            last = focusable[focusable.length - 1]
          if (
            e.shiftKey &&
            (document.activeElement === first ||
              document.activeElement === dialog.current)
          ) {
            e.preventDefault()
            last?.focus()
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault()
            first?.focus()
          }
        }
      }}
    >
      <button
        className="lightbox-close"
        onClick={onClose}
        aria-label="关闭影像"
      >
        <X />
      </button>
      <button
        className="lightbox-prev"
        onClick={(e) => {
          e.stopPropagation()
          previous()
        }}
        aria-label="上一张"
      >
        <ChevronLeft />
      </button>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <div>
          <MediaPreview key={current.id} item={current} full />
        </div>
        <p>
          {current.cat?.name ? current.cat.name + ' / ' : ''}
          {current.description || current.originalName || '珍贵存档'}
        </p>
        <small>
          {String(currentIndex + 1).padStart(2, '0')} / {items.length} · ← →
          翻页 / ESC 合上
        </small>
      </div>
      <button
        className="lightbox-next"
        onClick={(e) => {
          e.stopPropagation()
          next()
        }}
        aria-label="下一张"
      >
        <ChevronRight />
      </button>
    </div>
  )
}
