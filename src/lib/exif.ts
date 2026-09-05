import ExifReader from 'exif-reader'
import sharp from 'sharp'

export interface ExifResult {
  dateTaken?: Date
  data?: Record<string, any>
}

export async function extractExifData(filePath: string): Promise<ExifResult> {
  try {
    const metadata = await sharp(filePath).metadata()
    if (!metadata.exif) return {}
    const exifData = ExifReader(metadata.exif)

    let dateTaken: Date | undefined

    // Try to get the original date
    if (exifData.Photo?.DateTimeOriginal) {
      dateTaken = new Date(exifData.Photo.DateTimeOriginal)
    } else if (exifData.Image?.DateTime) {
      dateTaken = new Date(exifData.Image.DateTime)
    }

    return {
      dateTaken:
        dateTaken && !Number.isNaN(dateTaken.getTime()) ? dateTaken : undefined,
      data: exifData as unknown as Record<string, any>,
    }
  } catch (error) {
    console.error('Error extracting EXIF data:', error)
    return {}
  }
}
