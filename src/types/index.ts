export interface Cat {
  id: string
  name: string
  birthday?: string | null
  description?: string | null
  personality?: string | null
  avatar?: string | null
  color?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Media {
  id: string
  filename: string
  originalName: string
  filePath: string
  thumbnailPath?: string | null
  type: 'image' | 'video'
  description?: string | null
  dateTaken?: string | null
  exifData?: string | null
  catId?: string | null
  cat?: Cat | null
  createdAt: Date
  updatedAt: Date
}

export interface Diary {
  id: string
  title: string
  content: string
  mood?: string | null
  weather?: string | null
  catId?: string | null
  cat?: Cat | null
  createdAt: Date
  updatedAt: Date
  media?: DiaryMedia[]
}

export interface DiaryMedia {
  id: string
  diaryId: string
  mediaId: string
  media?: Media
}

export interface TimelineItem {
  date: string
  year: number
  month: number
  items: (Media | Diary)[]
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
