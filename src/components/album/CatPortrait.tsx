import { siteUrl } from '@/lib/urls'

export function CatPortrait({
  variant = 0,
  name,
  avatar,
}: {
  variant?: number
  name: string
  avatar?: string | null
}) {
  if (avatar)
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={siteUrl(avatar)}
        alt={name}
        loading="lazy"
        className="media-cover"
      />
    )
  const orange = variant % 2 === 0
  return (
    <div
      className={'cat-portrait ' + (orange ? 'cat-orange' : 'cat-gray')}
      role="img"
      aria-label={name + '的插画占位，等待真实照片'}
    >
      <svg viewBox="0 0 320 320" aria-hidden="true">
        <ellipse
          cx="161"
          cy="291"
          rx="100"
          ry="13"
          fill="#252820"
          opacity=".1"
        />
        <path
          d="M75 286 Q55 166 112 148 L210 148 Q261 207 248 286Z"
          fill={orange ? '#d88841' : '#acaca4'}
          stroke="#292c24"
          strokeWidth="4"
        />
        <path
          d="M86 116 L76 39 Q112 40 139 81 Q165 72 192 80 Q216 47 247 45 L231 129 Q249 215 163 220 Q70 216 86 116Z"
          fill={orange ? '#e8a962' : '#d4d0c5'}
          stroke="#292c24"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M89 61 L97 102 L122 85Z M233 65 L224 103 L207 86Z"
          fill="#eeaa9d"
        />
        <path
          d="M143 88 L149 118 M166 84 L169 118 M189 88 L183 118"
          stroke={orange ? '#a96937' : '#7a7c79'}
          strokeWidth="8"
          strokeLinecap="round"
        />
        <ellipse cx="163" cy="177" rx="46" ry="34" fill="#f6efd9" />
        <path
          d="M119 143 Q129 134 138 143 M188 143 Q198 134 206 143"
          fill="none"
          stroke="#292c24"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path d="M154 160 L171 160 L163 169Z" fill="#a65959" />
        <path
          d="M163 169 L163 177 Q151 188 144 178 M163 177 Q175 188 181 178"
          fill="none"
          stroke="#292c24"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M103 165 L64 157 M102 180 L60 183 M218 163 L260 152 M220 177 L264 181"
          stroke="#292c24"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M134 225 L132 284 M195 225 L197 284"
          fill="none"
          stroke="#292c24"
          strokeWidth="4"
        />
      </svg>
      <span className="portrait-note">等待 {name} 的照片</span>
    </div>
  )
}
