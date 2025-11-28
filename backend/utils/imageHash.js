const sharp = require('sharp');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');

async function generatePHash(imageBufferOrUrl) {
  let buffer;

  // Handle Cloudinary URL, local URL, or buffer
  if (typeof imageBufferOrUrl === 'string') {
    if (imageBufferOrUrl.startsWith('http')) {
      // Remote URL (Cloudinary)
      const response = await fetch(imageBufferOrUrl);
      if (!response.ok) throw new Error('Failed to fetch image');
      buffer = Buffer.from(await response.arrayBuffer());
    } else {
      // Local file path
      const fullPath = imageBufferOrUrl.startsWith('/uploads') 
        ? path.join(__dirname, '..', imageBufferOrUrl)
        : imageBufferOrUrl;
      buffer = fs.readFileSync(fullPath);
    }
  } else {
    buffer = imageBufferOrUrl;
  }

  // Process image: resize to 9x8 for dHash
  const { data: greyData } = await sharp(buffer)
    .resize(9, 8, { fit: 'fill', kernel: 'lanczos3' })
    .greyscale()
    .normalize()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Generate difference hash (dHash)
  let dhash = '';
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const leftPixel = greyData[row * 9 + col];
      const rightPixel = greyData[row * 9 + col + 1];
      dhash += leftPixel < rightPixel ? '1' : '0';
    }
  }

  // Get color histogram (8 bins per channel)
  const { data: colorData } = await sharp(buffer)
    .resize(64, 64, { fit: 'fill' })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const colorHist = { r: new Array(8).fill(0), g: new Array(8).fill(0), b: new Array(8).fill(0) };
  for (let i = 0; i < colorData.length; i += 3) {
    colorHist.r[Math.floor(colorData[i] / 32)]++;
    colorHist.g[Math.floor(colorData[i + 1] / 32)]++;
    colorHist.b[Math.floor(colorData[i + 2] / 32)]++;
  }

  // Normalize histogram
  const totalPixels = 64 * 64;
  for (let i = 0; i < 8; i++) {
    colorHist.r[i] = Math.round((colorHist.r[i] / totalPixels) * 100);
    colorHist.g[i] = Math.round((colorHist.g[i] / totalPixels) * 100);
    colorHist.b[i] = Math.round((colorHist.b[i] / totalPixels) * 100);
  }

  return JSON.stringify({ dhash, colorHist });
}

function calculateSimilarity(hash1Str, hash2Str) {
  try {
    const hash1 = JSON.parse(hash1Str);
    const hash2 = JSON.parse(hash2Str);

    // Calculate dHash Hamming distance
    let hammingDist = 0;
    for (let i = 0; i < hash1.dhash.length; i++) {
      if (hash1.dhash[i] !== hash2.dhash[i]) hammingDist++;
    }
    const dhashSimilarity = Math.max(0, 100 - (hammingDist * 1.5625));

    // Calculate color histogram similarity (Chi-Square distance)
    let colorDist = 0;
    for (let i = 0; i < 8; i++) {
      const rDiff = Math.abs(hash1.colorHist.r[i] - hash2.colorHist.r[i]);
      const gDiff = Math.abs(hash1.colorHist.g[i] - hash2.colorHist.g[i]);
      const bDiff = Math.abs(hash1.colorHist.b[i] - hash2.colorHist.b[i]);
      colorDist += (rDiff + gDiff + bDiff);
    }
    const colorSimilarity = Math.max(0, 100 - (colorDist / 6));

    // Combined similarity: 60% structure (dHash), 40% color
    const combinedSimilarity = (dhashSimilarity * 0.6) + (colorSimilarity * 0.4);

    return Math.round(combinedSimilarity);
  } catch (e) {
    return 0;
  }
}

module.exports = { generatePHash, calculateSimilarity };
