import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const publicDir = './public'

// Images to convert to WebP
const pngToWebp = [
  'athidi_care_life2.png',
  'athidi_care_life.png',
  'AthidiLogo.png',
  'hands.png',
]

// Large JPGs to compress
const jpgsToCompress = [
  'img10.jpg',
  'img11.jpg',
  'img2.jpg',
  'img23.jpg',
]

async function optimizeImages() {
  console.log('Starting image optimization...\n')

  // Convert PNGs to WebP
  for (const file of pngToWebp) {
    const inputPath = path.join(publicDir, file)
    const outputPath = path.join(publicDir, file.replace('.png', '.webp'))

    if (!fs.existsSync(inputPath)) {
      console.log(`Skipping ${file} - not found`)
      continue
    }

    const inputSize = fs.statSync(inputPath).size

    await sharp(inputPath)
      .webp({ quality: 85 })
      .toFile(outputPath)

    const outputSize = fs.statSync(outputPath).size
    const savings = ((1 - outputSize / inputSize) * 100).toFixed(1)

    console.log(`${file} -> ${file.replace('.png', '.webp')}`)
    console.log(`  ${(inputSize / 1024).toFixed(0)}KB -> ${(outputSize / 1024).toFixed(0)}KB (${savings}% smaller)\n`)
  }

  // Compress large JPGs
  for (const file of jpgsToCompress) {
    const inputPath = path.join(publicDir, file)
    const outputPath = path.join(publicDir, file.replace('.jpg', '-optimized.jpg'))

    if (!fs.existsSync(inputPath)) {
      console.log(`Skipping ${file} - not found`)
      continue
    }

    const inputSize = fs.statSync(inputPath).size

    await sharp(inputPath)
      .resize(1920, null, { withoutEnlargement: true }) // Max width 1920px
      .jpeg({ quality: 80, progressive: true })
      .toFile(outputPath)

    const outputSize = fs.statSync(outputPath).size
    const savings = ((1 - outputSize / inputSize) * 100).toFixed(1)

    // Replace original with optimized
    fs.unlinkSync(inputPath)
    fs.renameSync(outputPath, inputPath)

    console.log(`${file} compressed`)
    console.log(`  ${(inputSize / 1024).toFixed(0)}KB -> ${(outputSize / 1024).toFixed(0)}KB (${savings}% smaller)\n`)
  }

  console.log('Image optimization complete!')
}

optimizeImages().catch(console.error)
