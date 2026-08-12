/**
 * Mock data interceptor middleware when database connection is skipped (Local Development/Fast Test).
 * Extracted from server.js production entry point.
 */
export const mockInterceptor = (req, res, next) => {
  if (req.method === 'GET') {
    if (req.path === '/services') {
      return res.status(200).json({
        success: true,
        count: 1,
        data: [{
          _id: '660c1b48b1a45b85a3000001',
          title: 'Terrace Waterproofing',
          slug: 'terrace-waterproofing',
          category: 'terrace',
          shortDescription: 'Full terrace repair and chemical lining options.',
          fullDescription: 'Detailed polyurethane inspection and concrete coating application.',
          coverImage: 'https://res.cloudinary.com/demo/image/upload/w_800,h_500,c_fill/canyon.jpg',
          icon: 'droplet',
          isPublished: true,
          order: 1
        }]
      });
    }
    if (req.path === '/services/terrace-waterproofing') {
      return res.status(200).json({
        success: true,
        data: {
          _id: '660c1b48b1a45b85a3000001',
          title: 'Terrace Waterproofing',
          slug: 'terrace-waterproofing',
          category: 'terrace',
          shortDescription: 'Full terrace repair and chemical lining options.',
          fullDescription: 'Detailed polyurethane inspection and concrete coating application.',
          coverImage: 'https://res.cloudinary.com/demo/image/upload/w_800,h_500,c_fill/canyon.jpg',
          icon: 'droplet',
          isPublished: true,
          order: 1
        }
      });
    }
    if (req.path === '/testimonials') {
      return res.status(200).json({
        success: true,
        count: 1,
        data: [{
          _id: '660c1b48b1a45b85a3000002',
          clientName: 'Rajesh Patil',
          clientType: 'residential',
          text: 'Highly technical crew. The slab inspection detected moisture pathway precisely.',
          rating: 5,
          photo: 'https://res.cloudinary.com/demo/image/upload/w_100,h_100/sample.jpg',
          isPublished: true
        }]
      });
    }
    if (req.path === '/settings') {
      return res.status(200).json({
        success: true,
        data: {
          companyPhone: '+91 20 1234 5678',
          companyEmail: 'info@cwfcorporation.com',
          address: {
            street: '101, Apex Commercial Hub, MG Road',
            city: 'Pune',
            pincode: '411001',
            country: 'India'
          },
          businessHours: 'Monday - Saturday: 9:00 AM - 6:00 PM',
          socialLinks: {
            facebook: 'https://facebook.com/cwfcorporation',
            instagram: 'https://instagram.com/cwfcorporation',
            linkedin: 'https://linkedin.com/company/cwfcorporation'
          }
        }
      });
    }
    if (req.path === '/projects') {
      return res.status(200).json({
        success: true,
        count: 1,
        data: [{
          _id: '660c1b48b1a45b85a3000003',
          title: 'Terrace Slab Waterproofing & Leakage Repair',
          location: 'Kothrud, Pune',
          clientType: 'residential',
          serviceCategory: 'terrace',
          description: 'Active slab seepage resolved using scientific polyurethane injection.',
          beforeImages: ['https://res.cloudinary.com/demo/image/upload/w_800,h_500,c_fill/canyon.jpg'],
          afterImages: ['https://res.cloudinary.com/demo/image/upload/w_800,h_500,c_fill/canyon.jpg'],
          sqftTreated: 2500,
          completionDate: '2026-08-01T00:00:00.000Z',
          isFeatured: true
        }]
      });
    }
    if (req.path === '/team') {
      return res.status(200).json({
        success: true,
        count: 1,
        data: [{
          _id: '660c1b48b1a45b85a3000004',
          name: 'Vikram Shinde',
          designation: 'Senior Structural Auditor',
          photo: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_fill/sample.jpg',
          bio: '12 years waterproofing inspection experience.',
          order: 1
        }]
      });
    }
    if (req.path === '/blog') {
      return res.status(200).json({
        success: true,
        count: 1,
        data: [{
          _id: '660c1b48b1a45b85a3000005',
          title: 'Identifying Concrete Slab Leaks',
          slug: 'identifying-concrete-slab-leaks',
          content: '<p>Standard concrete is porous...</p>',
          coverImage: 'https://res.cloudinary.com/demo/image/upload/w_800,h_500,c_fill/canyon.jpg',
          publishedAt: '2026-08-01T00:00:00.000Z',
          author: { role: 'superadmin' }
        }]
      });
    }
  }
  next();
};
