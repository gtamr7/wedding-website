// Shrinks guest photos in the browser before they are uploaded.
//
// Supabase storage is on the free tier (1 GB). Phone photos run 2–4 MB each,
// which fills that bucket after roughly 250 uploads — well short of what a
// wedding produces. Re-encoding to a 1600px JPEG lands around 300 KB, so the
// same bucket holds a few thousand photos, and it looks identical on a phone.
//
// Every failure path returns the original file. Compression is an optimisation;
// it must never be the reason a guest cannot post a photo.

const MAX_EDGE = 1600
const QUALITY = 0.82
// Already small enough that re-encoding would mostly just cost quality.
const SKIP_BELOW_BYTES = 300 * 1024

async function decode(file: File): Promise<ImageBitmap | null> {
  try {
    // `from-image` applies EXIF orientation. Without it, photos taken in
    // portrait on a phone come out rotated once drawn to a canvas.
    return await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    try {
      return await createImageBitmap(file)
    } catch {
      // HEIC and anything else the browser cannot decode lands here.
      return null
    }
  }
}

export async function compressImage(file: File): Promise<File> {
  if (typeof window === 'undefined') return file
  if (!file.type.startsWith('image/')) return file
  if (file.size <= SKIP_BELOW_BYTES) return file
  // Animated GIFs would be flattened to a single frame.
  if (file.type === 'image/gif') return file

  const bitmap = await decode(file)
  if (!bitmap) return file

  try {
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return file

    // JPEG has no alpha channel, so anything transparent would otherwise
    // render as black.
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)
    ctx.drawImage(bitmap, 0, 0, width, height)

    const blob = await new Promise<Blob | null>(resolve =>
      canvas.toBlob(resolve, 'image/jpeg', QUALITY)
    )
    if (!blob) return file
    // Re-encoding can enlarge an already well-compressed image.
    if (blob.size >= file.size) return file

    const name = file.name.replace(/\.[^.]+$/, '') || 'photo'
    return new File([blob], `${name}.jpg`, { type: 'image/jpeg', lastModified: Date.now() })
  } catch {
    return file
  } finally {
    bitmap.close()
  }
}
