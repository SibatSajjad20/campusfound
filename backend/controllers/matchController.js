const { itemModel } = require("../models/itemModel");
const { matchModel } = require("../models/matchModel");

// Calculate Hamming distance between two hashes
const hammingDistance = (hash1, hash2) => {
  if (!hash1 || !hash2 || hash1.length !== hash2.length) return 100;
  let distance = 0;
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) distance++;
  }
  return distance;
};

// Convert Hamming distance to similarity percentage
const hashSimilarity = (hash1, hash2) => {
  if (!hash1 || !hash2) return 0;
  const distance = hammingDistance(hash1, hash2);
  const maxDistance = hash1.length * 4; // Each hex char represents 4 bits
  return Math.max(0, 100 - (distance / maxDistance) * 100);
};

// Improved text similarity function
const calculateTextSimilarity = (text1, text2) => {
  if (!text1 || !text2) return 0;

  const str1 = text1.toLowerCase().trim();
  const str2 = text2.toLowerCase().trim();

  // Exact match
  if (str1 === str2) return 100;

  // Contains match
  if (str1.includes(str2) || str2.includes(str1)) return 85;

  // Word-based similarity
  const words1 = str1.split(/\s+/).filter(word => word.length > 2);
  const words2 = str2.split(/\s+/).filter(word => word.length > 2);

  if (words1.length === 0 || words2.length === 0) return 0;

  const commonWords = words1.filter(word =>
    words2.some(w2 => w2.includes(word) || word.includes(w2))
  );

  const maxWords = Math.max(words1.length, words2.length);
  return (commonWords.length / maxWords) * 100;
};

const findMatches = async (newItem) => {
  try {
    // Find opposite type items in same category
    const oppositeType = newItem.type === 'lost' ? 'found' : 'lost';
    const candidateItems = await itemModel.find({
      type: oppositeType,
      category: newItem.category,
      status: 'active'
    });

    const matches = [];

    for (const candidate of candidateItems) {
      // Calculate text similarity
      const titleSimilarity = calculateTextSimilarity(newItem.title, candidate.title);
      const descSimilarity = calculateTextSimilarity(newItem.description, candidate.description);
      const locationSimilarity = calculateTextSimilarity(newItem.location, candidate.location);

      // Calculate enhanced image similarity using multiple methods
      let imageSimilarity = 0;
      if (newItem.imageHash && candidate.imageHash) {
        // Use enhanced similarity calculation
        const { hybridSimilarity, hammingDistance, colorHistogramSimilarity } = require('../utils/imageSearch');

        const phashDist = hammingDistance(newItem.imageHash, candidate.imageHash);
        imageSimilarity = hybridSimilarity(
          null, // No CLIP for automatic matching (too slow)
          phashDist,
          newItem.colorHistogram,
          candidate.colorHistogram
        );
      }

      // Enhanced weighted scoring with better image weight when available
      let overallSimilarity;
      if (newItem.imageHash && candidate.imageHash) {
        // With images: image 50%, title 25%, description 15%, location 10%
        overallSimilarity = (imageSimilarity * 0.5) + (titleSimilarity * 0.25) + (descSimilarity * 0.15) + (locationSimilarity * 0.1);
      } else {
        // No images: title 50%, description 30%, location 20%
        overallSimilarity = (titleSimilarity * 0.5) + (descSimilarity * 0.3) + (locationSimilarity * 0.2);
      }

      // Lower threshold for better recall (was 30, now 25 for more matches)
      if (overallSimilarity > 25) {
        matches.push({
          lostItem: newItem.type === 'lost' ? newItem._id : candidate._id,
          foundItem: newItem.type === 'found' ? newItem._id : candidate._id,
          similarity: Math.round(overallSimilarity)
        });
      }
    }

    // Save matches to database
    if (matches.length > 0) {
      await matchModel.insertMany(matches);
    }

    return matches;
  } catch (error) {
    console.error('Error finding matches:', error);
    return [];
  }
};

const getMatches = async (req, res) => {
  try {
    const matches = await matchModel.find({ status: 'pending' })
      .populate('lostItem', 'title description location reportedBy')
      .populate('foundItem', 'title description location reportedBy')
      .sort({ similarity: -1 });

    res.status(200).json({
      success: true,
      matches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: `Error fetching matches: ${error.message}`
    });
  }
};

const searchItems = async (req, res) => {
  try {
    const { query, category, type } = req.query;

    console.log('=== SEARCH DEBUG ===');
    console.log('Search params:', { query, category, type });

    // Build search filter
    let searchFilter = { status: 'active' };

    if (category && category.trim() !== '') {
      searchFilter.category = category.trim();
    }

    if (type && type.trim() !== '') {
      searchFilter.type = type.trim();
    }

    if (query && query.trim() !== '') {
      const searchTerm = query.trim();
      searchFilter.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { location: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    console.log('Search filter:', JSON.stringify(searchFilter, null, 2));

    let items = await itemModel.find(searchFilter)
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    console.log(`Search returned ${items.length} items`);

    // If text query provided, calculate relevance scores
    if (query && query.trim() !== '') {
      items = items.map(item => {
        const titleScore = calculateTextSimilarity(query, item.title);
        const descScore = calculateTextSimilarity(query, item.description);
        const locationScore = calculateTextSimilarity(query, item.location);
        const relevanceScore = (titleScore * 0.5) + (descScore * 0.3) + (locationScore * 0.2);
        return { ...item, relevanceScore };
      }).sort((a, b) => b.relevanceScore - a.relevanceScore);
    }

    res.status(200).json({
      success: true,
      count: items.length,
      items,
      searchFilter: searchFilter
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      msg: `Search error: ${error.message}`
    });
  }
};

module.exports = { findMatches, getMatches, searchItems };
