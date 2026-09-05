'use client'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { CatPortrait } from '@/components/album/CatPortrait'
import { siteUrl } from '@/lib/urls'
interface CatCardProps {
  id: string
  name: string
  description?: string | null
  personality?: string | null
  color?: string | null
  avatar?: string | null
}
export function FeaturedCats({ cats }: { cats: CatCardProps[] }) {
  return (
    <section className="album-section" id="residents">
      <div className="section-heading">
        <div>
          <span className="eyebrow">01 / THE RESIDENTS</span>
          <h2>
            本册常驻嘉宾<span className="handwritten">是家人呀。</span>
          </h2>
        </div>
        <Link href="/cats">
          认识它们 <ArrowUpRight size={17} />
        </Link>
      </div>
      {cats.length === 0 ? (
        <div className="paper-empty">
          两位主角的档案，等你慢慢写下。<Link href="/admin">去整理档案 ↗</Link>
        </div>
      ) : (
        <div className="resident-grid">
          {cats.map((cat, index) => (
            <Link
              href={'/cats/' + cat.id}
              className={'resident-card resident-' + (index % 2)}
              key={cat.id}
            >
              <div className="resident-image">
                {cat.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={siteUrl(cat.avatar)}
                    alt={cat.name}
                    loading="lazy"
                    className="media-cover"
                  />
                ) : (
                  <CatPortrait name={cat.name} variant={index} />
                )}
              </div>
              <div className="resident-copy">
                <span className="eyebrow">
                  RESIDENT / {String(index + 1).padStart(2, '0')}
                </span>
                <h3>
                  {cat.name}
                  <ArrowUpRight />
                </h3>
                <span className="tiny-tag">{cat.color || '家庭成员'}</span>
                <p>{cat.description || '关于它的故事，还在一天天变多。'}</p>
                <span className="resident-personality">
                  {cat.personality || '独一无二，可爱本人'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
