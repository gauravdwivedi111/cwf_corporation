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
  if (!url) return '/unsplash_0.webp';

  // If URL is an external link
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // If not Cloudinary, return external URL unaltered
    if (!url.includes('res.cloudinary.com')) {
      return url;
    }

    const uploadSegment = '/upload/';
    const uploadIndex = url.indexOf(uploadSegment);
    if (uploadIndex === -1) {
      return url;
    }

    const insertionPosition = uploadIndex + uploadSegment.length;
    const transformParams = `w_${width},q_auto,f_auto/`;
    return url.slice(0, insertionPosition) + transformParams + url.slice(insertionPosition);
  }

  // Local file path optimization
  let optimizedUrl = url.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  if (width <= 400) {
    return optimizedUrl.replace(/\.webp$/i, '-small.webp');
  }
  return optimizedUrl;
};
