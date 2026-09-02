/**
 * Optimizes Cloudinary asset URLs by injecting transform parameters.
 * If the resource is not hosted on Cloudinary, returns the URL unaltered.
 * 
 * @param {string} url - Original image URL
 * @param {number} width - Target width in pixels
 * @returns {string} - Optimized URL string
 */
export const getOptimizedCloudinaryUrl = (url, width = 800) => {
  if (!url || typeof url !== 'string') return '/unsplash_0.jpg';

  const cleanUrl = url.trim();
  if (!cleanUrl) return '/unsplash_0.jpg';

  // If Cloudinary resource, inject transforms
  if (cleanUrl.includes('res.cloudinary.com')) {
    const uploadSegment = '/upload/';
    const uploadIndex = cleanUrl.indexOf(uploadSegment);
    if (uploadIndex !== -1) {
      const insertionPosition = uploadIndex + uploadSegment.length;
      const transformParams = `w_${width},q_auto,f_auto/`;
      return cleanUrl.slice(0, insertionPosition) + transformParams + cleanUrl.slice(insertionPosition);
    }
  }

  // Preserve local and external images cleanly
  return cleanUrl;
};
