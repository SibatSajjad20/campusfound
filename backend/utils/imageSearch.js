const sharp = require('sharp');
const { HfInference } = require('@huggingface/inference');

const hf = new HfInference(process.env.HF_TOKEN);

// Generate CLIP embedding using Hugging Face
async function generateCLIPEmbedding(buffer) {
  try {
    if (!process.env.HF_TOKEN || process.env.HF_TOKEN === 'hf_your_token_here') {
      console.warn('HF_TOKEN not configured, skipping CLIP');
      return null;
    }

    // Use Xenova/clip-vit-base-patch32 which works on free tier
    const response = await hf.featureExtraction({
      model: 'Xenova/clip-vit-base-patch32',
      data: buffer
    });

    const embedding = Array.isArray(response[0]) ? response[0] : response;
    console.log('CLIP embedding generated, length:', embedding.length);
    return embedding;
  } catch (error) {
    console.error('CLIP embedding error:', error.message);
    return null;
  }
}

// Enhanced image preprocessing
async function preprocessImage(buffer) {
  try {
    // Apply preprocessing: resize, enhance contrast, reduce noise
    const processed = await sharp(buffer)
      .resize(256, 256, { fit: 'fill', kernel: 'lanczos3' })
      .normalise() // Enhance contrast
      .median(1) // Reduce noise
      .jpeg({ quality: 95 }) // Ensure consistent format
      .toBuffer();

    return processed;
  } catch (error) {
    console.error('Image preprocessing error:', error);
    return buffer; // Fallback to original
  }
}

// Generate true DCT-based pHash (perceptual hash)
async function generateTruePHash(buffer) {
  try {
    // Preprocess image first
    const processedBuffer = await preprocessImage(buffer);

    // Resize to 32x32 for DCT (standard pHash size)
    const { data, info } = await sharp(processedBuffer)
      .resize(32, 32, { fit: 'fill', kernel: 'lanczos3' })
      .greyscale()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Apply Discrete Cosine Transform (simplified)
    const dctMatrix = applyDCT(data, info.width, info.height);

    // Extract low-frequency components (top-left 8x8 of DCT)
    const lowFreq = [];
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        lowFreq.push(dctMatrix[y][x]);
      }
    }

    // Calculate median of low-frequency components
    const sorted = [...lowFreq].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];

    // Generate binary hash based on median
    let hash = '';
    for (const value of lowFreq) {
      hash += value > median ? '1' : '0';
    }

    console.log('True pHash generated, length:', hash.length);
    return hash;
  } catch (error) {
    console.error('True pHash generation error:', error);
    // Fallback to dHash if DCT fails
    return generateDHashFallback(buffer);
  }
}

// Fallback dHash implementation
async function generateDHashFallback(buffer) {
  try {
    const { data } = await sharp(buffer)
      .resize(9, 8, { fit: 'fill', kernel: 'lanczos3' })
      .greyscale()
      .normalize()
      .raw()
      .toBuffer({ resolveWithObject: true });

    let hash = '';
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const leftPixel = data[row * 9 + col];
        const rightPixel = data[row * 9 + col + 1];
        hash += leftPixel < rightPixel ? '1' : '0';
      }
    }
    return hash;
  } catch (error) {
    console.error('dHash fallback error:', error);
    return null;
  }
}

// Simplified DCT implementation for 2D array
function applyDCT(data, width, height) {
  const result = Array(height).fill().map(() => Array(width).fill(0));

  for (let u = 0; u < height; u++) {
    for (let v = 0; v < width; v++) {
      let sum = 0;
      for (let x = 0; x < height; x++) {
        for (let y = 0; y < width; y++) {
          const pixel = data[x * width + y];
          const cosX = Math.cos((Math.PI * u * (2 * x + 1)) / (2 * height));
          const cosY = Math.cos((Math.PI * v * (2 * y + 1)) / (2 * width));
          sum += pixel * cosX * cosY;
        }
      }
      const cu = u === 0 ? 1 / Math.sqrt(height) : Math.sqrt(2 / height);
      const cv = v === 0 ? 1 / Math.sqrt(width) : Math.sqrt(2 / width);
      result[u][v] = sum * cu * cv;
    }
  }

  return result;
}

// Generate color histogram for similarity comparison
async function generateColorHistogram(buffer) {
  try {
    // Resize to 64x64 for consistent histogram
    const { data } = await sharp(buffer)
      .resize(64, 64, { fit: 'fill' })
      .raw()
      .toBuffer({ resolveWithObject: true });

    const colorHist = { r: new Array(8).fill(0), g: new Array(8).fill(0), b: new Array(8).fill(0) };

    // Build histogram with 8 bins per channel
    for (let i = 0; i < data.length; i += 3) {
      colorHist.r[Math.floor(data[i] / 32)]++;
      colorHist.g[Math.floor(data[i + 1] / 32)]++;
      colorHist.b[Math.floor(data[i + 2] / 32)]++;
    }

    // Normalize histogram
    const totalPixels = 64 * 64;
    for (let i = 0; i < 8; i++) {
      colorHist.r[i] = Math.round((colorHist.r[i] / totalPixels) * 100);
      colorHist.g[i] = Math.round((colorHist.g[i] / totalPixels) * 100);
      colorHist.b[i] = Math.round((colorHist.b[i] / totalPixels) * 100);
    }

    return colorHist;
  } catch (error) {
    console.error('Color histogram generation error:', error);
    return null;
  }
}

// Calculate cosine similarity between two vectors
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Calculate Hamming distance for pHash
function hammingDistance(hash1, hash2) {
  if (!hash1 || !hash2 || hash1.length !== hash2.length) return 999;
  let distance = 0;
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) distance++;
  }
  return distance;
}

// Calculate color histogram similarity using Chi-Square distance
function colorHistogramSimilarity(hist1, hist2) {
  if (!hist1 || !hist2) return 0;

  let totalDistance = 0;
  let totalBins = 0;

  // Compare each channel
  ['r', 'g', 'b'].forEach(channel => {
    for (let i = 0; i < 8; i++) {
      const bin1 = hist1[channel][i] || 0;
      const bin2 = hist2[channel][i] || 0;
      const denominator = bin1 + bin2;

      if (denominator > 0) {
        const diff = bin1 - bin2;
        totalDistance += (diff * diff) / denominator;
        totalBins++;
      }
    }
  });

  // Convert to similarity score (lower distance = higher similarity)
  const avgDistance = totalDistance / totalBins;
  const similarity = Math.max(0, 100 - (avgDistance * 10)); // Scale factor

  return Math.round(similarity);
}

// Enhanced hybrid similarity: CLIP + pHash + Color Histogram
function hybridSimilarity(clipScore, phashDistance, colorHist1, colorHist2) {
  const clipSimilarity = clipScore * 100; // 0-1 to 0-100
  const phashSimilarity = Math.max(0, ((64 - phashDistance) / 64) * 100);
  const colorSimilarity = colorHistogramSimilarity(colorHist1, colorHist2);

  // Minimum thresholds for each component to avoid false positives
  const minClipThreshold = 0.3; // 30% minimum CLIP similarity
  const minPHashThreshold = 40; // 40% minimum pHash similarity
  const minColorThreshold = 30; // 30% minimum color similarity

  // If any component is below minimum threshold, penalize heavily
  let clipPenalty = (clipScore !== null && clipScore < minClipThreshold) ? 0.5 : 1.0;
  let phashPenalty = (phashDistance !== null && phashSimilarity < minPHashThreshold) ? 0.5 : 1.0;
  let colorPenalty = (colorHist1 && colorHist2 && colorSimilarity < minColorThreshold) ? 0.5 : 1.0;

  // Enhanced weighting: Prioritize CLIP for semantic accuracy, then structure, then color
  let weights = { clip: 0, phash: 0, color: 0 };
  let totalWeight = 0;

  if (clipScore !== null && clipScore !== undefined) {
    weights.clip = 0.7 * clipPenalty; // 70% when CLIP is available (highest priority)
    totalWeight += weights.clip;
  }

  if (phashDistance !== null && phashDistance !== undefined) {
    weights.phash = clipScore ? 0.25 * phashPenalty : 0.8 * phashPenalty; // 25% with CLIP, 80% without
    totalWeight += weights.phash;
  }

  if (colorHist1 && colorHist2) {
    weights.color = 0.05 * colorPenalty; // Only 5% color contribution (lowest priority)
    totalWeight += weights.color;
  }

  // If no CLIP and low pHash similarity, be very strict
  if (clipScore === null && phashSimilarity < 50) {
    weights.phash *= 0.5; // Reduce pHash weight if similarity is low
  }

  // Normalize weights
  if (totalWeight > 0) {
    const scale = 1 / totalWeight;
    weights.clip *= scale;
    weights.phash *= scale;
    weights.color *= scale;
  }

  const combined = (clipSimilarity * weights.clip) +
                  (phashSimilarity * weights.phash) +
                  (colorSimilarity * weights.color);

  // Additional penalty for completely different object types (based on color distribution)
  let objectTypePenalty = 1.0;
  if (colorHist1 && colorHist2) {
    const colorVariance1 = calculateHistogramVariance(colorHist1);
    const colorVariance2 = calculateHistogramVariance(colorHist2);
    const varianceDiff = Math.abs(colorVariance1 - colorVariance2);

    // Strong penalty for very different object types
    if (varianceDiff > 60) {
      objectTypePenalty = 0.3; // Very strong penalty for completely different objects
    } else if (varianceDiff > 40) {
      objectTypePenalty = 0.6; // Moderate penalty for somewhat different objects
    } else if (varianceDiff > 20) {
      objectTypePenalty = 0.8; // Light penalty for slightly different objects
    }

    // Additional check: if one is very uniform (like ID cards) and other is varied (like phones), extra penalty
    const uniformity1 = calculateHistogramUniformity(colorHist1);
    const uniformity2 = calculateHistogramUniformity(colorHist2);

    if ((uniformity1 > 0.7 && uniformity2 < 0.4) || (uniformity2 > 0.7 && uniformity1 < 0.4)) {
      objectTypePenalty *= 0.5; // Additional 50% penalty for uniform vs varied objects
    }
  }

  const finalSimilarity = Math.round(combined * objectTypePenalty);

  console.log(`Enhanced Hybrid: CLIP=${clipSimilarity.toFixed(1)}% (${weights.clip.toFixed(2)}), ` +
              `pHash=${phashSimilarity.toFixed(1)}% (${weights.phash.toFixed(2)}), ` +
              `Color=${colorSimilarity.toFixed(1)}% (${weights.color.toFixed(2)}), ` +
              `Penalties: CLIP=${clipPenalty.toFixed(1)}, pHash=${phashPenalty.toFixed(1)}, Color=${colorPenalty.toFixed(1)}, Object=${objectTypePenalty.toFixed(1)}, ` +
              `Final=${finalSimilarity}%`);

  return finalSimilarity;
}

// Calculate variance in color histogram to detect different object types
function calculateHistogramVariance(hist) {
  if (!hist) return 0;

  let totalVariance = 0;
  ['r', 'g', 'b'].forEach(channel => {
    const values = hist[channel];
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
    totalVariance += variance;
  });

  return totalVariance / 3; // Average across channels
}

// Calculate uniformity of color histogram (0 = varied colors, 1 = uniform/single color)
function calculateHistogramUniformity(hist) {
  if (!hist) return 0;

  let totalUniformity = 0;
  ['r', 'g', 'b'].forEach(channel => {
    const values = hist[channel];
    const maxValue = Math.max(...values);
    const total = values.reduce((a, b) => a + b, 0);

    // Uniformity = (max bin / total) - higher values mean more uniform colors
    const uniformity = total > 0 ? maxValue / total : 0;
    totalUniformity += uniformity;
  });

  return totalUniformity / 3; // Average across channels
}

module.exports = {
  generateCLIPEmbedding,
  generateTruePHash,
  generateColorHistogram,
  cosineSimilarity,
  hammingDistance,
  hybridSimilarity,
  colorHistogramSimilarity
};
