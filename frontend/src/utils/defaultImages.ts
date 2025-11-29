// Default images mapping for categories using emojis as data URIs
const defaultImages: { [key: string]: string } = {
  'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop',
  'Clothing': 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop',
  'Books': 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=400&fit=crop',
  'IDs/Wallets': 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop',
  'Keys': 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&h=400&fit=crop',
  'Jewelry': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
  'Bags/Backpacks': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
  'Sports Equipment': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop',
  'Supplies': 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&h=400&fit=crop',
  'Other': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop'
};

export const getDefaultImage = (category: string): string => {
  return defaultImages[category] || defaultImages['Other'];
};

export const getCategoryEmoji = (category: string): string => {
  const emojis: { [key: string]: string } = {
    'Electronics': '📱',
    'Clothing': '👕',
    'Books': '📚',
    'IDs/Wallets': '💳',
    'Keys': '🔑',
    'Jewelry': '💍',
    'Bags/Backpacks': '🎒',
    'Sports Equipment': '⚽',
    'Supplies': '✏️',
    'Other': '📦'
  };
  return emojis[category] || emojis['Other'];
};