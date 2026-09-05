'use client'
import { useEffect, useState, useRef } from 'react'
import { Upload, Trash2, X, Check, AlertCircle } from 'lucide-react'
import { apiFetch, siteUrl } from '@/lib/urls'
import { MediaPreview, AlbumMedia } from '@/components/album/MediaPreview'
import { Lightbox } from '@/components/gallery/Lightbox'
interface UploadResult {
  name: string
  success: boolean
  message: string
}
interface Cat {
  id: string
  name: string
}
export default function MediaManagementPage() {
  const [media, setMedia] = useState<AlbumMedia[]>([])
  const [cats, setCats] = useState<Cat[]>([])
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [refresh, setRefresh] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentFile, setCurrentFile] = useState('')
  const [results, setResults] = useState<UploadResult[]>([])
  const [selectedCat, setSelectedCat] = useState('')
  const [description, setDescription] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [maxFileSize, setMaxFileSize] = useState(52428800)
  const [index, setIndex] = useState<number | null>(null)
  const input = useRef<HTMLInputElement>(null)
  const uploadLock = useRef(false)

  useEffect(() => {
    apiFetch('/api/cats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCats(data.data)
      })
      .catch(() => {})
    apiFetch('/api/media/upload')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setMaxFileSize(data.maxFileSize)
      })
      .catch(() => {})
  }, [])
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    apiFetch('/api/media?pageSize=24&page=' + page, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) throw new Error('读取失败')
        setMedia(data.data.items)
        setPages(data.data.totalPages)
        setTotal(data.data.total)
      })
      .catch((error) => {
        if (error.name !== 'AbortError')
          setError('媒体列表读取失败，请刷新重试。')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [page, refresh])
  useEffect(() => {
    if (!uploading) return
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [uploading])

  function sendFile(file: File): Promise<AlbumMedia> {
    return new Promise((resolve, reject) => {
      const form = new FormData()
      form.append('file', file)
      if (selectedCat) form.append('catId', selectedCat)
      if (description) form.append('description', description)
      const xhr = new XMLHttpRequest()
      xhr.open('POST', siteUrl('/api/media/upload'))
      xhr.timeout = 30 * 60 * 1000
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable)
          setProgress(Math.round((event.loaded / event.total) * 100))
      }
      xhr.onload = () => {
        try {
          const data = JSON.parse(xhr.responseText)
          if (xhr.status >= 200 && xhr.status < 300 && data.success)
            resolve(data.data)
          else
            reject(new Error(data.error || '保存失败，请重新登录或检查服务器'))
        } catch {
          reject(
            new Error('服务器未返回有效结果，请检查代理上传大小和超时配置')
          )
        }
      }
      xhr.onerror = () =>
        reject(new Error('网络连接中断；结果未确认，请先刷新列表核对再重试'))
      xhr.ontimeout = () =>
        reject(new Error('上传超时；结果未确认，请先刷新列表核对再重试'))
      xhr.send(form)
    })
  }
  async function handleUpload(files: FileList | null) {
    if (!files?.length || uploadLock.current) return
    uploadLock.current = true
    setUploading(true)
    setResults([])
    try {
      for (const file of Array.from(files)) {
        setCurrentFile(file.name)
        setProgress(0)
        try {
          if (file.size > maxFileSize)
            throw new Error(
              '超过单文件 ' + Math.round(maxFileSize / 1048576) + ' MB 上限'
            )
          if (!file.size) throw new Error('不能上传空文件')
          await sendFile(file)
          setResults((prev) => [
            ...prev,
            {
              name: file.name,
              success: true,
              message: '原文件已保存，索引已登记',
            },
          ])
        } catch (error) {
          setResults((prev) => [
            ...prev,
            {
              name: file.name,
              success: false,
              message: error instanceof Error ? error.message : '上传失败',
            },
          ])
        }
      }
    } finally {
      uploadLock.current = false
      setUploading(false)
      setCurrentFile('')
      setProgress(0)
      setPage(1)
      setRefresh((value) => value + 1)
      if (input.current) input.current.value = ''
    }
  }
  async function remove(item: AlbumMedia) {
    if (
      !confirm(
        '确定永久删除“' + (item.originalName || '这份影像') + '”及其原文件吗？'
      )
    )
      return
    try {
      const res = await apiFetch('/api/media/' + item.id, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || '删除失败')
      if (media.length === 1 && page > 1) setPage(page - 1)
      else setRefresh((value) => value + 1)
    } catch (error) {
      setError(error instanceof Error ? error.message : '删除失败，请重试')
    }
  }

  return (
    <div>
      <div className="section-heading">
        <div>
          <span className="eyebrow">ARCHIVE DESK / 收藏工作台</span>
          <h2>把今天存下来。</h2>
        </div>
        <button
          className="ink-button"
          onClick={() => {
            setShowUpload(true)
            setResults([])
          }}
        >
          <Upload size={16} />
          上传影像
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        已收藏 {total} 份影像。点击照片可查看原图或播放视频。
      </p>
      {error && (
        <div role="alert" className="error-banner">
          {error}{' '}
          <button onClick={() => setRefresh((value) => value + 1)}>
            重新读取 ↻
          </button>
        </div>
      )}
      {loading ? (
        <div role="status" className="paper-empty">
          正在打开收藏…
        </div>
      ) : media.length === 0 ? (
        <div className="paper-empty">还没有影像，先收藏一张吧。</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {media.map((item, i) => (
            <div className="collection-card relative" key={item.id}>
              <button
                className="aspect-square block w-full overflow-hidden"
                onClick={() => setIndex(i)}
                aria-label={'预览' + item.originalName}
              >
                <MediaPreview item={item} />
              </button>
              <div className="p-2 pr-8">
                <p className="text-xs truncate">{item.originalName}</p>
                <small className="text-gray-500">
                  {item.cat?.name || '未关联猫咪'}
                </small>
              </div>
              <button
                className="absolute bottom-3 right-2 p-2 text-red-700"
                onClick={() => remove(item)}
                aria-label={'删除' + item.originalName}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="pagination">
        <button
          disabled={page <= 1 || loading}
          onClick={() => setPage(page - 1)}
        >
          ← 前一页
        </button>
        <span>
          {total ? page : 0} / {pages} 页
        </span>
        <button
          disabled={page >= pages || loading}
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
      {showUpload && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4"
          onClick={() => {
            if (!uploading) setShowUpload(false)
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label="上传影像"
            className="bg-white border border-gray-300 p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">新的回忆，入册。</h2>
              <button
                disabled={uploading}
                onClick={() => setShowUpload(false)}
                aria-label="关闭上传"
              >
                <X />
              </button>
            </div>
            <fieldset disabled={uploading} className="space-y-4">
              <label className="block text-sm">
                属于谁
                <select
                  value={selectedCat}
                  onChange={(e) => setSelectedCat(e.target.value)}
                  className="block w-full p-3 border mt-2"
                >
                  <option value="">共同的日常 / 不关联</option>
                  {cats.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                记一句话
                <input
                  value={description}
                  maxLength={2000}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="比如：下午三点，晒太阳的专业选手。"
                  className="block w-full p-3 border mt-2"
                />
              </label>
            </fieldset>
            <div
              className={
                'mt-5 p-8 text-center border-2 border-dashed ' +
                (dragging ? 'bg-green-50 border-green-700' : 'border-gray-300')
              }
              onDragOver={(e) => {
                e.preventDefault()
                if (!uploading) setDragging(true)
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragging(false)
                handleUpload(e.dataTransfer.files)
              }}
            >
              <Upload className="mx-auto mb-3" />
              <p className="text-sm mb-3">拖进来，把这一刻留下。</p>
              <button
                className="ink-button"
                disabled={uploading}
                onClick={() => input.current?.click()}
              >
                选择照片 / 视频
              </button>
              <input
                ref={input}
                type="file"
                multiple
                disabled={uploading}
                accept=".jpg,.jpeg,.png,.gif,.webp,.mp4,.webm,.mov"
                className="hidden"
                onChange={(e) => handleUpload(e.target.files)}
              />
              <p className="text-xs text-gray-500 mt-4">
                单文件 ≤ {Math.round(maxFileSize / 1048576)} MB · 支持批量上传
                <br />
                推荐 MP4（H.264）视频，MOV 是否能播放取决于浏览器。
              </p>
            </div>
            {uploading && (
              <div role="status" className="status-banner">
                <p className="truncate">{currentFile}</p>
                <progress max="100" value={progress} className="w-full my-2" />
                <p>
                  {progress < 100
                    ? '正在传输 ' + progress + '%'
                    : '传输完成，正在确认原文件与索引保存…'}
                </p>
              </div>
            )}
            {results.length > 0 && (
              <div aria-live="polite" className="mt-4 space-y-3">
                {results.map((result, i) => (
                  <div
                    key={i}
                    className={
                      'p-3 text-xs border ' +
                      (result.success
                        ? 'bg-green-50 text-green-800'
                        : 'bg-red-50 text-red-800')
                    }
                  >
                    <div className="flex gap-2 items-center">
                      {result.success ? (
                        <Check size={15} />
                      ) : (
                        <AlertCircle size={15} />
                      )}
                      <span className="truncate">{result.name}</span>
                    </div>
                    <p className="mt-2">{result.message}</p>
                  </div>
                ))}
              </div>
            )}
            {!uploading && results.length > 0 && (
              <button
                className="ink-button mt-5 w-full"
                onClick={() => setShowUpload(false)}
              >
                完成，返回收藏
              </button>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
