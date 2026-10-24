import { readFile, stat } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PRODUCT_PHOTO_IDS } from '../src/shared/utils/productPhotoIds.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outputDir = join(root, 'public', 'images', 'products')
const MIN_IMAGE_BYTES = 5_000

async function isValidJpeg(path) {
  try {
    const info = await stat(path)
    if (!info.isFile() || info.size < MIN_IMAGE_BYTES) return false
    const bytes = await readFile(path)
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
  } catch {
    return false
  }
}

const missing = []
for (const id of PRODUCT_PHOTO_IDS) {
  if (!(await isValidJpeg(join(outputDir, `${id}.jpg`)))) missing.push(id)
}

if (missing.length) {
  console.error(`\n${missing.length} عکس محلی ناموجود یا خراب است:`)
  for (const id of missing) console.error(`- public/images/products/${id}.jpg`)
  console.error('فایل‌های پروژه را کامل استخراج کنید و دوباره npm install و npm run deploy را اجرا کنید.')
  process.exit(1)
}

console.log(`بررسی تصاویر موفق بود: ${PRODUCT_PHOTO_IDS.length} عکس محلی آمادهٔ استفاده است؛ هیچ دانلود شبکه‌ای لازم نیست.`)
