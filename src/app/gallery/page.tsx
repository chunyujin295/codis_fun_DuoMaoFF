'use client'
import { useEffect, useState } from 'react'
import { Lightbox } from '@/components/gallery/Lightbox'
import { MediaPreview, AlbumMedia } from '@/components/album/MediaPreview'
import { apiFetch } from '@/lib/urls'
interface Cat {
  id: string
  name: string
}
export default function GalleryPage() {
  const [media, setMedia] = useState<AlbumMedia[]>([])
  const [cats, setCats] = useState<Cat[]>([])
  const [catId, setCatId] = useState('')
  const [type, setType] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  const [index, setIndex] = useState<number | null>(null)
  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get('catId')
    if (initial) setCatId(initial)
    apiFetch('/api/cats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCats(data.data)
      })
      .catch(() => {})
  }, [])
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    setIndex(null)
    const query = new URLSearchParams({ page: String(page), pageSize: '24' })
    if (catId) query.set('catId', catId)
    if (type) query.set('type', type)
    apiFetch('/api/media?' + query, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) throw new Error('相册读取失败')
        setMedia(data.data.items)
        setTotalPages(data.data.totalPages)
        setTotal(data.data.total)
      })
      .catch((error) => {
        if (error.name !== 'AbortError')
          setError('暂时没能打开影像抽屉，请重试。')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [catId, type, page, retry])
  return (
    <div className="collection-page">
      <div className="collection-heading">
        <div>
          <span className="eyebrow">THE PHOTO DRAWER / 影像收藏</span>
          <h1>这些，全部留着。</h1>
          <p>模糊的、打哈欠的、睡到四脚朝天的。都是宝贝。</p>
        </div>
        <span className="handwritten">一张也舍不得删 ↙</span>
      </div>
      <div className="collection-toolbar">
        <div className="collection-filters">
          <button
            className="filter-chip"
            aria-pressed={!catId}
            onClick={() => {
              setCatId('')
              setPage(1)
            }}
          >
            全部主角
          </button>
          {cats.map((cat) => (
            <button
              key={cat.id}
              className="filter-chip"
              aria-pressed={catId === cat.id}
              onClick={() => {
                setCatId(cat.id)
                setPage(1)
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <div className="collection-filters">
          {[
            ['', '全部影像'],
            ['image', '照片'],
            ['video', '视频'],
          ].map(([value, label]) => (
            <button
              key={value}
              className="filter-chip"
              aria-pressed={type === value}
              onClick={() => {
                setType(value)
                setPage(1)
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {error ? (
        <div role="alert" className="error-banner">
          {error}{' '}
          <button onClick={() => setRetry(retry + 1)}>重新打开 ↻</button>
        </div>
      ) : loading ? (
        <div className="paper-empty" role="status">
          正在翻开影像抽屉…
        </div>
      ) : !media.length ? (
        <div className="paper-empty">这一格抽屉，等着装进新的回忆。</div>
      ) : (
        <div className="collection-grid">
          {media.map((item, i) => (
            <button
              key={item.id}
              className="collection-card"
              onClick={() => setIndex(i)}
              aria-label={
                '查看' + (item.description || item.originalName || '影像')
              }
            >
              <div className="moment-image">
                <MediaPreview item={item} />
              </div>
              <div className="moment-caption">
                <span>
                  {item.description || item.originalName || '普通的一天'}
                </span>
                <small>
                  {item.cat?.name || '生活存档'} /{' '}
                  {item.createdAt
                    ? new Date(
                        item.dateTaken || item.createdAt
                      ).toLocaleDateString('zh-CN')
                    : ''}
                </small>
              </div>
            </button>
          ))}
        </div>
      )}
      <div className="pagination">
        <button
          disabled={loading || page <= 1}
          onClick={() => setPage(page - 1)}
        >
          ← 前一页
        </button>
        <span>
          {total ? page : 0} / {totalPages} 页 · {total} 份收藏
        </span>
        <button
          disabled={loading || page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          后一页 →
        </button>
      </div>
      {index !== null && (
        <Lightbox
          items={media}
          currentIndex={index}
          onClose={() => setIndex(null)}
          onNavigate={setIndex}
        />
      )}
    </div>
  )
}
