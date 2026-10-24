import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PRODUCT_PHOTOS } from './seed/product-images.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outputDir = join(root, 'public', 'images', 'products')
const MIN_IMAGE_BYTES = 5_000
const CONCURRENCY = 4

function photoIdFromUrl(source) {
  const url = new URL(source)
  if (url.hostname !== 'images.unsplash.com') {
    throw new Error(`Unexpected photo host: ${url.hostname}`)
  }
  return url.pathname.replace(/^\/+/, '')
}

async function isValidJpeg(path) {
  try {
    const info = await stat(path)
    if (!info.isFile() || info.size < MIN_IMAGE_BYTES) return false
    const file = await readFile(path)
    return file[0] === 0xff && file[1] === 0xd8 && file[2] === 0xff
  } catch {
    return false
  }
}

function jpegSource(source) {
  const url = new URL(source)
  url.search = ''
  url.searchParams.set('fit', 'max')
  url.searchParams.set('w', '720')
  url.searchParams.set('q', '80')
  url.searchParams.set('fm', 'jpg')
  return url
}

async function downloadOne(source) {
  const photoId = photoIdFromUrl(source)
  const destination = join(outputDir, `${photoId}.jpg`)
  if (await isValidJpeg(destination)) return 'cached'

  const url = jpegSource(source)
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'DarooyarPortfolioImageDownloader/1.0',
      Accept: 'image/jpeg,image/*;q=0.9,*/*;q=0.5',
    },
    signal: AbortSignal.timeout(30_000),
  })

  if (!response.ok) {
    throw new Error(`${photoId}: HTTP ${response.status} ${response.statusText}`)
  }
  const contentType = response.headers.get('content-type') || ''
  const bytes = Buffer.from(await response.arrayBuffer())
  if (!contentType.toLowerCase().includes('image/') || bytes.length < MIN_IMAGE_BYTES) {
    throw new Error(`${photoId}: response was not a valid image (${contentType || 'unknown content type'})`)
  }
  if (!(bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff)) {
    throw new Error(`${photoId}: expected JPEG bytes but received a different format`)
  }

  await writeFile(destination, bytes)
  return 'downloaded'
}

async function main() {
  await mkdir(outputDir, { recursive: true })
  const results = []
  const failures = []
  let nextIndex = 0

  async function worker() {
    while (nextIndex < PRODUCT_PHOTOS.length) {
      const index = nextIndex++
      const source = PRODUCT_PHOTOS[index]
      try {
        results[index] = await downloadOne(source)
      } catch (error) {
        failures.push({ source, message: error instanceof Error ? error.message : String(error) })
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, PRODUCT_PHOTOS.length) }, worker))

  if (failures.length) {
    console.error(`\nدریافت ${failures.length} عکس ناموفق بود. انتشار متوقف شد تا تصاویر ناقص منتشر نشوند.`)
    for (const failure of failures) console.error(`- ${failure.message}\n  ${failure.source}`)
    console.error('دسترسی اینترنت به images.unsplash.com را بررسی کنید و سپس دوباره npm run deploy را اجرا کنید.')
    process.exitCode = 1
    return
  }

  const downloaded = results.filter((result) => result === 'downloaded').length
  const cached = results.filter((result) => result === 'cached').length
  console.log(`عکس‌های محصول آماده‌اند: ${downloaded} عکس دریافت شد، ${cached} عکس از فایل‌های محلی استفاده شد.`)
  console.log(`مسیر تصاویر: ${outputDir}`)
}

await main()
