'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { CatPortrait } from '@/components/album/CatPortrait'
import { MediaPreview, AlbumMedia } from '@/components/album/MediaPreview'
import { siteUrl } from '@/lib/urls'

export function HeroSection({ media = [] }: { media?: AlbumMedia[] }) {
  const [stamped, setStamped] = useState(false)
  const photos = media.filter((item) => item.type === 'image')
  return (
    <section className="scrapbook-hero">
      <div className="hero-topline">
        <span>一份持续更新的 / 猫咪生活样本</span>
        <span>PRIVATE COLLECTION · VOL. 01</span>
      </div>
      <div className="hero-layout">
        <div className="hero-copy">
          <div className="eyebrow">
            <i /> HELLO, THIS IS OUR LITTLE WORLD.
          </div>
          <h1>
            日子很小，
            <br />
            <span className="hero-emphasis">有你们</span>
            <br />
            就好<span className="hero-period">。</span>
          </h1>
          <p className="hero-description">
            多多、毛毛，和一些舍不得删掉的瞬间。
            <br />
            把普通的一天，认真收藏起来。
          </p>
          <Link className="ink-button" href="/gallery">
            翻开我们的收藏册 <ArrowUpRight size={20} />
          </Link>
          <span className="handwritten hero-note">有猫的日子，值得存档 ↗</span>
        </div>
        <div className="hero-collage">
          <span className="collage-grid" aria-hidden="true" />
          <div className="polaroid polaroid-back">
            <div className="tape" aria-hidden="true" />
            {photos[1] ? (
              <MediaPreview item={photos[1]} />
            ) : (
              <CatPortrait variant={1} name="毛毛" />
            )}
            <p>
              {photos[1]?.description || '毛毛 / 慢一点也没关系'}{' '}
              <span>02</span>
            </p>
          </div>
          <div className="polaroid polaroid-front">
            <div className="tape" aria-hidden="true" />
            {photos[0] ? (
              <MediaPreview item={photos[0]} />
            ) : (
              <CatPortrait name="多多" />
            )}
            <p>
              {photos[0]?.description || '多多 / 今天也有好好晒太阳'}{' '}
              <span>01</span>
            </p>
          </div>
          <span className="lime-sticker">
            本册含有
            <br />
            <strong>大量猫毛</strong>
            <small>100% FUR REAL</small>
          </span>
          <button
            className={'paw-stamp ' + (stamped ? 'is-stamped' : '')}
            onClick={() => setStamped(!stamped)}
            aria-pressed={stamped}
            aria-label="盖一个猫爪印章"
          >
            <Image
              src={siteUrl('/doc/img/icon.png')}
              alt=""
              width={78}
              height={78}
            />
            <span>{stamped ? '已盖爪，喵！' : '按一下，盖个爪'}</span>
          </button>
          <span className="handwritten collage-note">
            都是我的宝贝。
            <ArrowDownRight size={42} strokeWidth={1} />
          </span>
        </div>
      </div>
      <div className="hero-bottomline">
        <span>两只猫 · 一个家 · 数不清的小事</span>
        <a href="#residents">向下翻一页 ↓</a>
      </div>
    </section>
  )
}
