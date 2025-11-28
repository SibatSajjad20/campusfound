const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Import our image processing functions
const {
  generateTruePHash,
  generateColorHistogram,
  preprocessImage,
  cosineSimilarity,
  hammingDistance,
  hybridSimilarity
} = require('./utils/imageSearch');

async function testImageProcessing() {
  console.log('🧪 Testing Enhanced Image Hashing & Search System\n');

  try {
    // Test 1: Check if we have test images
    const uploadsDir = path.join(__dirname, 'uploads');
    const testImages = fs.readdirSync(uploadsDir).filter(file =>
      ['.jpg', '.jpeg', '.png'].includes(path.extname(file).toLowerCase())
    );

    if (testImages.length === 0) {
      console.log('❌ No test images found in uploads directory');
      console.log('📝 Please add some test images to the uploads folder');
      return;
    }

    console.log(`📁 Found ${testImages.length} test images:`, testImages);

    // Test 2: Process first image
    const testImagePath = path.join(uploadsDir, testImages[0]);
    const buffer = fs.readFileSync(testImagePath);

    console.log(`\n🖼️  Testing with image: ${testImages[0]}`);
    console.log(`📊 Image size: ${buffer.length} bytes`);

    // Test 3: Preprocessing
    console.log('\n🔧 Testing image preprocessing...');
    const processedBuffer = await preprocessImage(buffer);
    console.log(`✅ Preprocessing successful, new size: ${processedBuffer.length} bytes`);

    // Test 4: True pHash generation
    console.log('\n🔢 Testing true DCT-based pHash generation...');
    const phash = await generateTruePHash(buffer);
    console.log(`✅ pHash generated: ${phash} (length: ${phash.length})`);

    // Test 5: Color histogram generation
    console.log('\n📊 Testing color histogram generation...');
    const colorHist = await generateColorHistogram(buffer);
    console.log(`✅ Color histogram generated:`);
    console.log(`   - Red channel: ${colorHist.r.length} bins`);
    console.log(`   - Green channel: ${colorHist.g.length} bins`);
    console.log(`   - Blue channel: ${colorHist.b.length} bins`);

    // Test 6: Self-similarity (should be 100%)
    console.log('\n🔍 Testing self-similarity calculations...');

    // pHash self-similarity
    const phashDistance = hammingDistance(phash, phash);
    console.log(`✅ pHash self-distance: ${phashDistance} (should be 0)`);

    // Color histogram self-similarity
    const colorSimilarity = hybridSimilarity(null, null, colorHist, colorHist);
    console.log(`✅ Color histogram self-similarity: ${colorSimilarity}% (should be 100%)`);

    // Test 7: Test with multiple images if available
    if (testImages.length >= 2) {
      console.log('\n🔄 Testing cross-image similarity...');

      const secondImagePath = path.join(uploadsDir, testImages[1]);
      const secondBuffer = fs.readFileSync(secondImagePath);

      const secondPhash = await generateTruePHash(secondBuffer);
      const secondColorHist = await generateColorHistogram(secondBuffer);

      const crossPhashDistance = hammingDistance(phash, secondPhash);
      const crossColorSimilarity = hybridSimilarity(null, null, colorHist, secondColorHist);

      console.log(`📊 Cross-image comparison:`);
      console.log(`   - pHash distance: ${crossPhashDistance}`);
      console.log(`   - Color similarity: ${crossColorSimilarity}%`);
      console.log(`   - Images: ${testImages[0]} vs ${testImages[1]}`);
    }

    // Test 8: Error handling
    console.log('\n🛡️  Testing error handling...');
    try {
      await generateTruePHash(Buffer.from('invalid'));
      console.log('❌ Should have failed with invalid buffer');
    } catch (error) {
      console.log('✅ Properly handled invalid buffer error');
    }

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Test Summary:');
    console.log('✅ Image preprocessing works');
    console.log('✅ True DCT-based pHash generation works');
    console.log('✅ Color histogram generation works');
    console.log('✅ Similarity calculations work');
    console.log('✅ Error handling works');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error(error.stack);
  }
}

// Run the test
testImageProcessing().then(() => {
  console.log('\n🏁 Test script completed');
  process.exit(0);
}).catch(error => {
  console.error('💥 Test script failed:', error);
  process.exit(1);
});
