import { getOptimizedCloudinaryUrl } from './cloudinaryUrl.js';

// Category-to-image mapping for all services and projects
const CATEGORY_IMAGES = {
  // Civil & Waterproofing
  'waterproofing': '/unsplash_9.jpg',
  'repairs': '/unsplash_8.jpg',
  'rehabilitation': '/unsplash_11.jpg',
  'inspection': '/unsplash_15.jpg',
  'quality-assurance': '/unsplash_9.jpg',
  'boq-estimation': '/unsplash_20.jpg',
  'supervision': '/unsplash_22.jpg',
  'terrace': '/terrace_waterproofing.png',
  'basement': '/basement_grouting.jpg',
  'bathroom': '/bathroom_sealing.jpg',
  'tank': '/unsplash_9.jpg',
  'facade': '/exterior_facade.jpg',
  'injection-grouting': '/injection_grouting.jpg',
  'flooring': '/flooring_after.png',

  // Software & Web
  'website-development': '/unsplash_13.jpg',
  'business-portals': '/unsplash_7.jpg',
  'corporate-site': '/unsplash_7.jpg',
  'ecommerce-solutions': '/unsplash_4.jpg',
  'e-commerce': '/unsplash_4.jpg',
  'mobile-apps': '/unsplash_5.jpg',
  'web-app': '/unsplash_0.jpg',
  'digital-branding': '/unsplash_6.jpg',
  'digital-marketing': '/unsplash_7.jpg',
  'seo-maintenance': '/unsplash_7.jpg',
  'crm-automation': '/unsplash_0.jpg',
  'custom-development': '/unsplash_14.jpg',
  'online-solutions': '/unsplash_14.jpg',

  // Financial Advisory
  'investment-planning': '/unsplash_10.jpg',
  'investment-advisory': '/unsplash_10.jpg',
  'insurance-solutions': '/unsplash_23.jpg',
  'loan-assistance': '/unsplash_20.jpg',
  'business-loan': '/unsplash_20.jpg',
  'working-capital': '/unsplash_23.jpg',
  'nri-corner': '/unsplash_25.jpg',
  'behavioural-profiling': '/unsplash_12.jpg',
  'risk-profiling': '/unsplash_19.jpg',
  'financial-planning': '/unsplash_23.jpg',
  'tax-consultancy': '/unsplash_10.jpg',
  'personal-loan': '/unsplash_20.jpg',
  'wealth-guidance': '/unsplash_2.jpg',
};

const SEGMENT_DEFAULT_IMAGES = {
  civil: ['/unsplash_9.jpg', '/terrace_waterproofing.png', '/basement_grouting.jpg', '/unsplash_8.jpg', '/flooring_after.png', '/unsplash_11.jpg', '/injection_grouting.jpg', '/exterior_facade.jpg'],
  web: ['/unsplash_13.jpg', '/unsplash_4.jpg', '/unsplash_0.jpg', '/unsplash_7.jpg', '/unsplash_5.jpg', '/unsplash_6.jpg', '/unsplash_14.jpg'],
  finance: ['/unsplash_10.jpg', '/unsplash_20.jpg', '/unsplash_23.jpg', '/unsplash_25.jpg', '/unsplash_12.jpg', '/unsplash_19.jpg', '/unsplash_2.jpg'],
};

/**
 * Resolves a high-quality image URL for a service card or detail view.
 */
export const getServiceImage = (service, segment = 'civil', index = 0, width = 500) => {
  if (service?.coverImage && typeof service.coverImage === 'string' && service.coverImage.trim() !== '') {
    return getOptimizedCloudinaryUrl(service.coverImage, width);
  }
  const categoryImage = CATEGORY_IMAGES[service?.category];
  if (categoryImage) {
    return getOptimizedCloudinaryUrl(categoryImage, width);
  }
  const defaults = SEGMENT_DEFAULT_IMAGES[segment] || SEGMENT_DEFAULT_IMAGES.civil;
  return getOptimizedCloudinaryUrl(defaults[index % defaults.length], width);
};

/**
 * Resolves a high-quality image URL for a portfolio project card or modal view.
 */
export const getProjectImage = (project, segment = 'civil', index = 0, width = 500) => {
  if (project?.coverImage && typeof project.coverImage === 'string' && project.coverImage.trim() !== '') {
    return getOptimizedCloudinaryUrl(project.coverImage, width);
  }
  if (project?.gallery?.[0] && typeof project.gallery[0] === 'string' && project.gallery[0].trim() !== '') {
    return getOptimizedCloudinaryUrl(project.gallery[0], width);
  }
  if (project?.afterImages?.[0] && typeof project.afterImages[0] === 'string' && project.afterImages[0].trim() !== '') {
    return getOptimizedCloudinaryUrl(project.afterImages[0], width);
  }
  const categoryImage = CATEGORY_IMAGES[project?.serviceCategory];
  if (categoryImage) {
    return getOptimizedCloudinaryUrl(categoryImage, width);
  }
  const defaults = SEGMENT_DEFAULT_IMAGES[segment] || SEGMENT_DEFAULT_IMAGES.civil;
  return getOptimizedCloudinaryUrl(defaults[index % defaults.length], width);
};

/**
 * Resolves a high-quality image URL for a blog post card or reader view.
 */
export const getBlogImage = (post, segment = 'civil', index = 0, width = 500) => {
  if (post?.coverImage && typeof post.coverImage === 'string' && post.coverImage.trim() !== '') {
    return getOptimizedCloudinaryUrl(post.coverImage, width);
  }
  const defaults = SEGMENT_DEFAULT_IMAGES[segment] || SEGMENT_DEFAULT_IMAGES.civil;
  return getOptimizedCloudinaryUrl(defaults[index % defaults.length], width);
};
