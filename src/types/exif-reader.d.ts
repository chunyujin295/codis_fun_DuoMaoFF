declare module 'exif-reader' {
  const ExifReader: {
    (buffer: Buffer): any
    [key: string]: any
  }
  export default ExifReader
}
