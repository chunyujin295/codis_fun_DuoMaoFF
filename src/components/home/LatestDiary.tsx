'use client'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
interface DiaryItem {
  id: string
  title: string
  content: string
  mood?: string | null
  weather?: string | null
  cat?: { name: string } | null
  createdAt: string
}
export function LatestDiary({ diary }: { diary: DiaryItem[] }) {
  return (
    <section className="album-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">03 / NOTES TO KEEP</span>
          <h2>
            铲屎官的碎碎念<span className="handwritten">小事也值得记。</span>
          </h2>
        </div>
        <Link href="/diary">
          所有日记 <ArrowUpRight size={17} />
        </Link>
      </div>
      {diary.length ? (
        <div className="notes-grid">
          {diary.map((item, index) => (
            <Link
              href={'/diary/' + item.id}
              key={item.id}
              className="note-card"
            >
              <span className="note-number">
                NOTE / {String(index + 1).padStart(2, '0')}
              </span>
              <span className="note-mood">{item.mood || '✳'}</span>
              <h3>{item.title}</h3>
              <p>{item.content}</p>
              <div>
                <time>
                  {new Date(item.createdAt).toLocaleDateString('zh-CN')}
                </time>
                <ArrowUpRight size={18} />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="paper-empty">
          今天，它们又做了什么可爱的小事？
          <Link href="/admin/diary">写下第一篇碎碎念 ↗</Link>
        </div>
      )}
    </section>
  )
}
