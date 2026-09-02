import { getOptimizedCloudinaryUrl } from './cloudinaryUrl.js';

/**
 * EXACT MAPPING OF EVERY SERVICE ACROSS ALL 3 VERTICALS (CIVIL, WEB, FINANCE)
 * Scraped and synchronized directly from the local hosted website dataset.
 */
const EXACT_SERVICE_IMAGES = {
  // 1. Civil & Waterproofing
  'waterproofing': '/unsplash_9.jpg',
  'flooring': '/unsplash_24.jpg',
  'flooring-systems': '/unsplash_24.jpg',
  'landscaping': '/unsplash_17.jpg',
  'corporate-landscaping': '/unsplash_17.jpg',
  'painting': '/unsplash_21.jpg',
  'professional-painting': '/unsplash_21.jpg',
  'repairs': '/unsplash_8.jpg',
  'structural-civil-repairs': '/unsplash_8.jpg',
  'rehabilitation': '/unsplash_11.jpg',
  'rehabilitation-restoration': '/unsplash_11.jpg',
  'inspection': '/unsplash_15.jpg',
  'technical-inspection': '/unsplash_15.jpg',
  'quality-assurance': '/unsplash_1.jpg',
  'quality-assurance-services': '/unsplash_1.jpg',
  'boq-estimation': '/unsplash_20.jpg',
  'boq-cost-estimation': '/unsplash_20.jpg',
  'supervision': '/unsplash_22.jpg',
  'project-application-supervision': '/unsplash_22.jpg',
  'terrace': '/terrace_waterproofing.png',
  'basement': '/basement_grouting.jpg',
  'bathroom': '/bathroom_sealing.jpg',
  'facade': '/exterior_facade.jpg',
  'injection-grouting': '/injection_grouting.jpg',

  // 2. Software & Web
  'website-development': '/unsplash_13.jpg',
  'website-development-services': '/unsplash_13.jpg',
  'business-portals': '/unsplash_7.jpg',
  'business-websites-portals': '/unsplash_7.jpg',
  'ecommerce-solutions': '/unsplash_4.jpg',
  'ecommerce-solutions-custom': '/unsplash_4.jpg',
  'mobile-apps': '/unsplash_5.jpg',
  'mobile-web-applications': '/unsplash_5.jpg',
  'digital-branding': '/unsplash_6.jpg',
  'digital-branding-identity': '/unsplash_6.jpg',
  'digital-marketing': '/unsplash_3.jpg',
  'digital-marketing-campaigns': '/unsplash_3.jpg',
  'crm-automation': '/unsplash_0.jpg',
  'crm-business-automation': '/unsplash_0.jpg',
  'online-solutions': '/unsplash_14.jpg',
  'online-business-solutions': '/unsplash_14.jpg',

  // 3. Financial Advisory
  'investment-planning': '/unsplash_10.jpg',
  'investment-planning-solutions': '/unsplash_10.jpg',
  'insurance-solutions': '/unsplash_23.jpg',
  'corporate-insurance-solutions': '/unsplash_23.jpg',
  'loan-assistance': '/unsplash_20.jpg',
  'credit-loan-assistance': '/unsplash_20.jpg',
  'nri-corner': '/unsplash_25.jpg',
  'nri-financial-corner': '/unsplash_25.jpg',
  'behavioural-profiling': '/unsplash_12.jpg',
  'behavioural-profiling-wealth': '/unsplash_12.jpg',
  'risk-profiling': '/unsplash_19.jpg',
  'risk-profiling-advisory': '/unsplash_19.jpg',
  'financial-planning': '/unsplash_16.jpg',
  'financial-planning-systems': '/unsplash_16.jpg',
  'wealth-guidance': '/unsplash_2.jpg',
  'wealth-portfolio-guidance': '/unsplash_2.jpg',
};

/**
 * EXACT MAPPING OF EVERY PORTFOLIO CASE STUDY ACROSS ALL 3 VERTICALS
 */
const EXACT_PROJECT_IMAGES = {
  // Civil
  'terrace slab waterproofing & leakage repair': '/terrace_waterproofing.png',
  'basement retaining wall grouting': '/basement_grouting.jpg',
  'industrial epoxy flooring overhaul': '/flooring_after.png',

  // Web
  'global agri-export e-commerce portal': '/unsplash_4.jpg',
  'pune fintech saas dashboard': '/unsplash_0.jpg',
  'high-performance next.js corporate portal': '/unsplash_7.jpg',

  // Finance
  'debt restructuring for manufacturing enterprise': '/unsplash_20.jpg',
  'working capital optimisation & funding round': '/unsplash_23.jpg',
  'corporate tax planning & compliance overhaul': '/unsplash_10.jpg',
};

/**
 * EXACT MAPPING OF EVERY BLOG POST ACROSS ALL 3 VERTICALS
 */
const EXACT_BLOG_IMAGES = {
  // Civil
  'identifying-concrete-slab-leaks': '/unsplash_8.jpg',
  'identifying concrete slab leaks': '/unsplash_8.jpg',
  'negative-side-waterproofing-explained': '/unsplash_9.jpg',
  'negative side waterproofing explained': '/unsplash_9.jpg',

  // Web
  'scaling-enterprise-apps-nodejs': '/unsplash_0.jpg',
  'modern scaling strategies for enterprise apps': '/unsplash_0.jpg',
  'headless-vs-traditional-cms': '/unsplash_13.jpg',
  'choosing a modern cms: headless vs traditional': '/unsplash_13.jpg',

  // Finance
  'working-capital-loans-smes': '/unsplash_23.jpg',
  'understanding working capital loans for smes': '/unsplash_23.jpg',
  'tax-planning-checklist-fy-2026': '/unsplash_20.jpg',
  'tax planning checklist for indian businesses in fy 2026': '/unsplash_20.jpg',
  'prepare-business-loan-application': '/unsplash_10.jpg',
  'how to prepare for a business loan application': '/unsplash_10.jpg',
};

const SEGMENT_DEFAULT_IMAGES = {
  civil: ['/unsplash_9.jpg', '/unsplash_24.jpg', '/unsplash_17.jpg', '/unsplash_21.jpg', '/unsplash_8.jpg', '/unsplash_11.jpg', '/unsplash_15.jpg', '/unsplash_1.jpg', '/unsplash_20.jpg', '/unsplash_22.jpg'],
  web: ['/unsplash_13.jpg', '/unsplash_7.jpg', '/unsplash_4.jpg', '/unsplash_5.jpg', '/unsplash_6.jpg', '/unsplash_3.jpg', '/unsplash_0.jpg', '/unsplash_14.jpg'],
  finance: ['/unsplash_10.jpg', '/unsplash_23.jpg', '/unsplash_20.jpg', '/unsplash_25.jpg', '/unsplash_12.jpg', '/unsplash_19.jpg', '/unsplash_16.jpg', '/unsplash_2.jpg'],
};

/**
 * Resolves the exact distinct image for any service card or detail page.
 */
export const getServiceImage = (service, segment = 'civil', index = 0, width = 500) => {
  if (service?.coverImage && typeof service.coverImage === 'string' && service.coverImage.trim() !== '') {
    return getOptimizedCloudinaryUrl(service.coverImage, width);
  }
  const bySlug = EXACT_SERVICE_IMAGES[service?.slug?.toLowerCase()];
  if (bySlug) return getOptimizedCloudinaryUrl(bySlug, width);

  const byCategory = EXACT_SERVICE_IMAGES[service?.category?.toLowerCase()];
  if (byCategory) return getOptimizedCloudinaryUrl(byCategory, width);

  const defaults = SEGMENT_DEFAULT_IMAGES[segment] || SEGMENT_DEFAULT_IMAGES.civil;
  return getOptimizedCloudinaryUrl(defaults[index % defaults.length], width);
};

/**
 * Resolves the exact distinct image for any project case study card or modal.
 */
export const getProjectImage = (project, segment = 'civil', index = 0, width = 500) => {
  if (project?.coverImage && typeof project.coverImage === 'string' && project.coverImage.trim() !== '') {
    return getOptimizedCloudinaryUrl(project.coverImage, width);
  }
  const byTitle = EXACT_PROJECT_IMAGES[project?.title?.toLowerCase()?.trim()];
  if (byTitle) return getOptimizedCloudinaryUrl(byTitle, width);

  if (project?.gallery?.[0] && typeof project.gallery[0] === 'string' && project.gallery[0].trim() !== '') {
    return getOptimizedCloudinaryUrl(project.gallery[0], width);
  }
  if (project?.afterImages?.[0] && typeof project.afterImages[0] === 'string' && project.afterImages[0].trim() !== '') {
    return getOptimizedCloudinaryUrl(project.afterImages[0], width);
  }

  const byCategory = EXACT_SERVICE_IMAGES[project?.serviceCategory?.toLowerCase()];
  if (byCategory) return getOptimizedCloudinaryUrl(byCategory, width);

  const defaults = SEGMENT_DEFAULT_IMAGES[segment] || SEGMENT_DEFAULT_IMAGES.civil;
  return getOptimizedCloudinaryUrl(defaults[index % defaults.length], width);
};

/**
 * Resolves the exact distinct image for any blog post card or reader page.
 */
export const getBlogImage = (post, segment = 'civil', index = 0, width = 500) => {
  if (post?.coverImage && typeof post.coverImage === 'string' && post.coverImage.trim() !== '') {
    return getOptimizedCloudinaryUrl(post.coverImage, width);
  }
  const bySlug = EXACT_BLOG_IMAGES[post?.slug?.toLowerCase()?.trim()];
  if (bySlug) return getOptimizedCloudinaryUrl(bySlug, width);

  const byTitle = EXACT_BLOG_IMAGES[post?.title?.toLowerCase()?.trim()];
  if (byTitle) return getOptimizedCloudinaryUrl(byTitle, width);

  const defaults = SEGMENT_DEFAULT_IMAGES[segment] || SEGMENT_DEFAULT_IMAGES.civil;
  return getOptimizedCloudinaryUrl(defaults[index % defaults.length], width);
};

/**
 * Fallback handler for onError event on HTML <img> elements.
 */
export const handleImageError = (e, segment = 'civil', index = 0) => {
  if (e && e.currentTarget) {
    e.currentTarget.onerror = null;
    const defaults = SEGMENT_DEFAULT_IMAGES[segment] || SEGMENT_DEFAULT_IMAGES.civil;
    e.currentTarget.src = defaults[index % defaults.length] || '/unsplash_0.jpg';
  }
};
