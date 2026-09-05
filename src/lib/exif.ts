import ExifReader from 'exif-reader'
import fs from 'fs'

export interface ExifResult {
  dateTaken?: Date
  data?: Record<string, any>
}

export async function extractExifData(filePath: string): Promise<ExifResult> {
  try {
    const buffer = fs.readFileSync(filePath)
    const exifData = ExifReader(buffer)

    let dateTaken: Date | undefined

    // Try to get the original date
    if (exifData.Photo?.DateTimeOriginal) {
      dateTaken = new Date(exifData.Photo.DateTimeOriginal)
    } else if (exifData.Image?.DateTime) {
      dateTaken = new Date(exifData.Image.DateTime)
    }

    return {
      dateTaken,
      data: exifData as unknown as Record<string, any>,
    }
  } catch (error) {
    console.error('Error extracting EXIF data:', error)
    return {}
  }
}
