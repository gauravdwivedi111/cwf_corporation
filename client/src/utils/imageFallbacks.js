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
  'website development': '/unsplash_13.jpg',
  'business-portals': '/unsplash_7.jpg',
  'business-websites-portals': '/unsplash_7.jpg',
  'business websites & portals': '/unsplash_7.jpg',
  'business websites and portals': '/unsplash_7.jpg',
  'ecommerce-solutions': '/unsplash_4.jpg',
  'ecommerce-solutions-custom': '/unsplash_4.jpg',
  'e-commerce solutions': '/unsplash_4.jpg',
  'mobile-apps': '/unsplash_5.jpg',
  'mobile-web-applications': '/unsplash_5.jpg',
  'mobile & web applications': '/unsplash_5.jpg',
  'mobile and web applications': '/unsplash_5.jpg',
  'digital-branding': '/unsplash_6.jpg',
  'digital-branding-identity': '/unsplash_6.jpg',
  'digital branding': '/unsplash_6.jpg',
  'digital-marketing': '/unsplash_3.jpg',
  'digital-marketing-campaigns': '/unsplash_3.jpg',
  'digital marketing': '/unsplash_3.jpg',
  'crm-automation': '/unsplash_0.jpg',
  'crm-business-automation': '/unsplash_0.jpg',
  'crm & business automation': '/unsplash_0.jpg',
  'crm and business automation': '/unsplash_0.jpg',
  'online-solutions': '/unsplash_14.jpg',
  'online-business-solutions': '/unsplash_14.jpg',
  'online business solutions': '/unsplash_14.jpg',

  // 3. Financial Advisory (Using custom uploaded corporate assets)
  'investment-planning': '/finance_investment_advisory.png',
  'investment-planning-solutions': '/finance_investment_advisory.png',
  'investment planning': '/finance_investment_advisory.png',
  'insurance-solutions': '/finance_advisory_overview.png',
  'corporate-insurance-solutions': '/finance_advisory_overview.png',
  'insurance solutions': '/finance_advisory_overview.png',
  'loan-assistance': '/finance_loan_guidance.png',
  'credit-loan-assistance': '/finance_loan_guidance.png',
  'loan assistance': '/finance_loan_guidance.png',
  'nri-corner': '/unsplash_25.jpg',
  'nri-financial-corner': '/unsplash_25.jpg',
  'nri corner': '/unsplash_25.jpg',
  'behavioural-profiling': '/unsplash_12.jpg',
  'behavioural-profiling-wealth': '/unsplash_12.jpg',
  'behavioural profiling': '/unsplash_12.jpg',
  'risk-profiling': '/unsplash_19.jpg',
  'risk-profiling-advisory': '/unsplash_19.jpg',
  'risk profiling': '/unsplash_19.jpg',
  'financial-planning': '/finance_cash_flow_planning.jpg',
  'financial-planning-systems': '/finance_cash_flow_planning.jpg',
  'financial planning': '/finance_cash_flow_planning.jpg',
  'wealth-guidance': '/finance_startup_advisory.png',
  'wealth-portfolio-guidance': '/finance_startup_advisory.png',
  'wealth & portfolio guidance': '/finance_startup_advisory.png',
  'wealth and portfolio guidance': '/finance_startup_advisory.png',
};

/**
 * EXACT MAPPING OF EVERY PORTFOLIO CASE STUDY ACROSS ALL 3 VERTICALS
 */
const EXACT_PROJECT_IMAGES = {
  // Civil
  'terrace slab waterproofing & leakage repair': '/terrace_waterproofing.png',
  'terrace slab waterproofing and leakage repair': '/terrace_waterproofing.png',
  'basement retaining wall grouting': '/basement_grouting.jpg',
  'industrial epoxy flooring overhaul': '/flooring_after.png',

  // Web
  'global agri-export e-commerce portal': '/unsplash_4.jpg',
  'pune fintech saas dashboard': '/unsplash_0.jpg',
  'high-performance next.js corporate portal': '/unsplash_7.jpg',

  // Finance
  'debt restructuring for manufacturing enterprise': '/unsplash_20.jpg',
  'working capital optimisation & funding round': '/unsplash_23.jpg',
  'working capital optimization & funding round': '/unsplash_23.jpg',
  'corporate tax planning & compliance overhaul': '/unsplash_10.jpg',
  'corporate tax planning and compliance overhaul': '/unsplash_10.jpg',
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
  'choosing a modern cms': '/unsplash_13.jpg',

  // Finance
  'working-capital-loans-smes': '/unsplash_23.jpg',
  'understanding working capital loans for smes': '/unsplash_23.jpg',
  'tax-planning-checklist-fy-2026': '/unsplash_20.jpg',
  'tax planning checklist for indian businesses in fy 2026': '/unsplash_20.jpg',
  'tax planning checklist for indian businesses': '/unsplash_20.jpg',
  'prepare-business-loan-application': '/unsplash_10.jpg',
  'how to prepare for a business loan application': '/unsplash_10.jpg',
};

const SEGMENT_DEFAULT_IMAGES = {
  civil: ['/unsplash_9.jpg', '/unsplash_24.jpg', '/unsplash_17.jpg', '/unsplash_21.jpg', '/unsplash_8.jpg', '/unsplash_11.jpg', '/unsplash_15.jpg', '/unsplash_1.jpg', '/unsplash_20.jpg', '/unsplash_22.jpg'],
  web: ['/unsplash_13.jpg', '/unsplash_7.jpg', '/unsplash_4.jpg', '/unsplash_5.jpg', '/unsplash_6.jpg', '/unsplash_3.jpg', '/unsplash_0.jpg', '/unsplash_14.jpg'],
  finance: ['/finance_investment_advisory.png', '/finance_advisory_overview.png', '/finance_loan_guidance.png', '/unsplash_25.jpg', '/unsplash_12.jpg', '/unsplash_19.jpg', '/finance_cash_flow_planning.jpg', '/finance_startup_advisory.png'],
};

/**
 * Resolves the exact distinct image for any service card or detail page.
 * Guarantees distinct visual images by prioritizing exact category/slug lookups.
 */
export const getServiceImage = (service, segment = 'civil', index = 0, width = 500) => {
  if (!service) {
    const defaults = SEGMENT_DEFAULT_IMAGES[segment] || SEGMENT_DEFAULT_IMAGES.civil;
    return getOptimizedCloudinaryUrl(defaults[index % defaults.length], width);
  }

  // 1. Custom user-uploaded Cloudinary image (distinct uploads from admin)
  if (service.coverImage && (service.coverImage.startsWith('http://') || service.coverImage.startsWith('https://')) && service.coverImage.includes('res.cloudinary.com')) {
    return getOptimizedCloudinaryUrl(service.coverImage, width);
  }

  // 2. Exact match by slug
  if (service.slug) {
    const cleanSlug = service.slug.toLowerCase().trim();
    if (EXACT_SERVICE_IMAGES[cleanSlug]) {
      return getOptimizedCloudinaryUrl(EXACT_SERVICE_IMAGES[cleanSlug], width);
    }
  }

  // 3. Exact match by category
  if (service.category) {
    const cleanCat = service.category.toLowerCase().trim();
    if (EXACT_SERVICE_IMAGES[cleanCat]) {
      return getOptimizedCloudinaryUrl(EXACT_SERVICE_IMAGES[cleanCat], width);
    }
  }

  // 4. Exact match by title
  if (service.title) {
    const cleanTitle = service.title.toLowerCase().trim();
    if (EXACT_SERVICE_IMAGES[cleanTitle]) {
      return getOptimizedCloudinaryUrl(EXACT_SERVICE_IMAGES[cleanTitle], width);
    }
  }

  // 5. If coverImage is a specialized local file (e.g. terrace_waterproofing.png)
  if (service.coverImage && typeof service.coverImage === 'string' && service.coverImage.trim() !== '' && !service.coverImage.includes('unsplash')) {
    return getOptimizedCloudinaryUrl(service.coverImage, width);
  }

  // 6. Deterministic default per index so every card has a distinct image
  const defaults = SEGMENT_DEFAULT_IMAGES[segment] || SEGMENT_DEFAULT_IMAGES.civil;
  return getOptimizedCloudinaryUrl(defaults[index % defaults.length], width);
};

/**
 * Resolves the exact distinct image for any project case study card or modal.
 */
export const getProjectImage = (project, segment = 'civil', index = 0, width = 500) => {
  if (!project) {
    const defaults = SEGMENT_DEFAULT_IMAGES[segment] || SEGMENT_DEFAULT_IMAGES.civil;
    return getOptimizedCloudinaryUrl(defaults[index % defaults.length], width);
  }

  // 1. Custom user-uploaded Cloudinary image
  if (project.coverImage && (project.coverImage.startsWith('http://') || project.coverImage.startsWith('https://')) && project.coverImage.includes('res.cloudinary.com')) {
    return getOptimizedCloudinaryUrl(project.coverImage, width);
  }

  // 2. Match by title
  if (project.title) {
    const cleanTitle = project.title.toLowerCase().trim();
    if (EXACT_PROJECT_IMAGES[cleanTitle]) {
      return getOptimizedCloudinaryUrl(EXACT_PROJECT_IMAGES[cleanTitle], width);
    }
  }

  // 3. Match by serviceCategory
  if (project.serviceCategory) {
    const cleanCat = project.serviceCategory.toLowerCase().trim();
    if (EXACT_PROJECT_IMAGES[cleanCat]) {
      return getOptimizedCloudinaryUrl(EXACT_PROJECT_IMAGES[cleanCat], width);
    }
    if (EXACT_SERVICE_IMAGES[cleanCat]) {
      return getOptimizedCloudinaryUrl(EXACT_SERVICE_IMAGES[cleanCat], width);
    }
  }

  // 4. If specialized local asset
  if (project.coverImage && typeof project.coverImage === 'string' && project.coverImage.trim() !== '' && !project.coverImage.includes('unsplash')) {
    return getOptimizedCloudinaryUrl(project.coverImage, width);
  }

  // 5. Deterministic fallback by index
  const defaults = SEGMENT_DEFAULT_IMAGES[segment] || SEGMENT_DEFAULT_IMAGES.civil;
  return getOptimizedCloudinaryUrl(defaults[index % defaults.length], width);
};

/**
 * Resolves the exact distinct image for any blog post card or reader page.
 */
export const getBlogImage = (post, segment = 'civil', index = 0, width = 500) => {
  if (!post) {
    const defaults = SEGMENT_DEFAULT_IMAGES[segment] || SEGMENT_DEFAULT_IMAGES.civil;
    return getOptimizedCloudinaryUrl(defaults[index % defaults.length], width);
  }

  // 1. Custom user-uploaded Cloudinary image
  if (post.coverImage && (post.coverImage.startsWith('http://') || post.coverImage.startsWith('https://')) && post.coverImage.includes('res.cloudinary.com')) {
    return getOptimizedCloudinaryUrl(post.coverImage, width);
  }

  // 2. Match by slug
  if (post.slug) {
    const cleanSlug = post.slug.toLowerCase().trim();
    if (EXACT_BLOG_IMAGES[cleanSlug]) {
      return getOptimizedCloudinaryUrl(EXACT_BLOG_IMAGES[cleanSlug], width);
    }
  }

  // 3. Match by title
  if (post.title) {
    const cleanTitle = post.title.toLowerCase().trim();
    if (EXACT_BLOG_IMAGES[cleanTitle]) {
      return getOptimizedCloudinaryUrl(EXACT_BLOG_IMAGES[cleanTitle], width);
    }
  }

  // 4. Deterministic fallback by index
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
