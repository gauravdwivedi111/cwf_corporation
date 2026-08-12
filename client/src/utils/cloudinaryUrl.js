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

  // If the resource is a local file (does not contain res.cloudinary.com)
  if (!url.includes('res.cloudinary.com')) {
    // Convert any png/jpg/jpeg paths to webp format
    let optimizedUrl = url.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    
    // If layout requests width <= 400, load the small WebP version
    if (width <= 400) {
      return optimizedUrl.replace(/\.webp$/i, '-small.webp');
    }
    return optimizedUrl;
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
