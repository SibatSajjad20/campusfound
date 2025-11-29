// Default images mapping for categories
const defaultImages: { [key: string]: string } = {
  'Electronics': '/defaultItemImages/electronics.png',
  'Clothing': '/defaultItemImages/clothing2.png',
  'Books': '/defaultItemImages/books.png',
  'IDs/Wallets': '/defaultItemImages/idswallets.png',
  'Keys': '/defaultItemImages/keys.png',
  'Jewelry': '/defaultItemImages/jewelry.png',
  'Bags/Backpacks': '/defaultItemImages/bags.png',
  'Sports Equipment': '/defaultItemImages/others.png',
  'Supplies': '/defaultItemImages/others.png',
  'Other': '/defaultItemImages/others.png'
};

export const getDefaultImage = (category: string): string => {
  return defaultImages[category] || defaultImages['Other'];
};

