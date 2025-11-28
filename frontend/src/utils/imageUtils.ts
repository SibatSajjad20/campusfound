export const getImageUrl = (imageUrl: string | null | undefined): string | null => {
  if (!imageUrl) return null;
  
  // If it's already a full URL (Cloudinary), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it's a local path, prepend the backend URL
  return `http://localhost:3000${imageUrl}`;
};
