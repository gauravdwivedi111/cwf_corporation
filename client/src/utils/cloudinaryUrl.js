/**
 * Optimizes Cloudinary asset URLs by injecting transform parameters.
 * If the URL is not a Cloudinary resource, it returns the original URL unaltered.
 * 
 * Target transforms:
 * - w_[width] : Scales image to the desired width (reduces file weight)
 * - q_auto: Adjusts quality automatically based on network speeds
 * - f_auto: Serves modern formats (like WebP or AVIF) dynamically based on client support
 * 
 * @param {string} url - Original image URL
 * @param {number} width - Target width in pixels
 * @returns {string} - Optimized URL string
 */
export const getOptimizedCloudinaryUrl = (url, width = 800) => {
  if (!url) return '';

  // If the resource is not hosted on Cloudinary, return the original URL
  if (!url.includes('res.cloudinary.com')) {
    return url;
  }

  const uploadSegment = '/upload/';
  const uploadIndex = url.indexOf(uploadSegment);

  // If URL doesn't contain the standard /upload/ segment, return as-is
  if (uploadIndex === -1) {
    return url;
  }

  const insertionPosition = uploadIndex + uploadSegment.length;
  const transformParams = `w_${width},q_auto,f_auto/`;

  return url.slice(0, insertionPosition) + transformParams + url.slice(insertionPosition);
};
