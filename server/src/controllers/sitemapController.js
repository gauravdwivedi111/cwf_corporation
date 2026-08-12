import Service from '../models/Service.js';
import BlogPost from '../models/BlogPost.js';

/**
 * @desc    Generate a dynamic sitemap.xml based on active database collections
 * @route   GET /sitemap.xml
 * @access  Public
 */
export const getDynamicSitemap = async (req, res, next) => {
  try {
    // Retrieve published service categories and blog posts
    const services = await Service.find({ isPublished: true }).select('slug updatedAt');
    const blogs = await BlogPost.find({ isPublished: true }).select('slug updatedAt');

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Helper to print a single URL element
    const appendUrlNode = (pathname, lastmod = new Date(), changefreq = 'weekly', priority = '0.5') => {
      const dateString = new Date(lastmod).toISOString().split('T')[0];
      return `  <url>\n    <loc>${clientUrl}${pathname}</loc>\n    <lastmod>${dateString}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
    };

    // 1. Append Static Routes
    xml += appendUrlNode('/', new Date(), 'daily', '1.0');
    xml += appendUrlNode('/about', new Date(), 'monthly', '0.8');
    xml += appendUrlNode('/services', new Date(), 'weekly', '0.9');
    xml += appendUrlNode('/projects', new Date(), 'weekly', '0.8');
    xml += appendUrlNode('/blog', new Date(), 'daily', '0.8');
    xml += appendUrlNode('/contact', new Date(), 'monthly', '0.7');

    // 2. Append Dynamic Waterproofing Services
    services.forEach((service) => {
      xml += appendUrlNode(`/services/${service.slug}`, service.updatedAt || new Date(), 'weekly', '0.8');
    });

    // 3. Append Dynamic Blog Posts
    blogs.forEach((post) => {
      xml += appendUrlNode(`/blog/${post.slug}`, post.updatedAt || new Date(), 'weekly', '0.7');
    });

    xml += '</urlset>';

    // Serve with proper MIME type headers
    res.header('Content-Type', 'application/xml');
    res.status(200).send(xml);
  } catch (error) {
    next(error);
  }
};
