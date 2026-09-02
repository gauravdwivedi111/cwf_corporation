import User from '../models/User.js';
import SiteSettings from '../models/SiteSettings.js';
import SegmentInfo from '../models/SegmentInfo.js';
import Service, { CivilService, WebService, FinanceService } from '../models/Service.js';
import Project, { CivilProject, WebProject, FinanceProject } from '../models/Project.js';
import BlogPost from '../models/BlogPost.js';
import Testimonial from '../models/Testimonial.js';
import TeamMember from '../models/TeamMember.js';
import Inquiry from '../models/Inquiry.js';

const SERVICE_IMAGES_SYNC = {
  // Civil
  'waterproofing': '/unsplash_9.jpg',
  'flooring-systems': '/unsplash_24.jpg',
  'corporate-landscaping': '/unsplash_17.jpg',
  'professional-painting': '/unsplash_21.jpg',
  'structural-civil-repairs': '/unsplash_8.jpg',
  'rehabilitation-restoration': '/unsplash_11.jpg',
  'technical-inspection': '/unsplash_15.jpg',
  'quality-assurance-services': '/unsplash_1.jpg',
  'boq-cost-estimation': '/unsplash_20.jpg',
  'project-application-supervision': '/unsplash_22.jpg',

  // Web
  'website-development-services': '/unsplash_13.jpg',
  'business-websites-portals': '/unsplash_7.jpg',
  'ecommerce-solutions-custom': '/unsplash_4.jpg',
  'mobile-web-applications': '/unsplash_5.jpg',
  'digital-branding-identity': '/unsplash_6.jpg',
  'digital-marketing-campaigns': '/unsplash_3.jpg',
  'crm-business-automation': '/unsplash_0.jpg',
  'online-business-solutions': '/unsplash_14.jpg',

  // Finance
  'investment-planning-solutions': '/unsplash_10.jpg',
  'corporate-insurance-solutions': '/unsplash_23.jpg',
  'credit-loan-assistance': '/unsplash_20.jpg',
  'nri-financial-corner': '/unsplash_25.jpg',
  'behavioural-profiling-wealth': '/unsplash_12.jpg',
  'risk-profiling-advisory': '/unsplash_19.jpg',
  'financial-planning-systems': '/unsplash_16.jpg',
  'wealth-portfolio-guidance': '/unsplash_2.jpg',
};

const BLOG_IMAGES_SYNC = {
  'identifying-concrete-slab-leaks': '/unsplash_8.jpg',
  'negative-side-waterproofing-explained': '/unsplash_9.jpg',
  'scaling-enterprise-apps-nodejs': '/unsplash_0.jpg',
  'headless-vs-traditional-cms': '/unsplash_13.jpg',
  'working-capital-loans-smes': '/unsplash_23.jpg',
  'tax-planning-checklist-fy-2026': '/unsplash_20.jpg',
  'prepare-business-loan-application': '/unsplash_10.jpg',
};

export const autoSeedIfEmpty = async () => {
  try {
    // 0. Synchronize / update image paths for all existing services and blogs
    for (const [slug, img] of Object.entries(SERVICE_IMAGES_SYNC)) {
      await Service.updateOne({ slug }, { $set: { coverImage: img, gallery: [img] } });
    }
    for (const [slug, img] of Object.entries(BLOG_IMAGES_SYNC)) {
      await BlogPost.updateOne({ slug }, { $set: { coverImage: img } });
    }

    const serviceCount = await Service.countDocuments({});
    const projectCount = await Project.countDocuments({});
    const blogCount = await BlogPost.countDocuments({});
    const userCount = await User.countDocuments({ role: 'superadmin' });

    console.log('[AutoSeed] Checking and populating missing database records for Civil, Web, and Finance...');

    // 1. Ensure Superadmin Account exists
    if (userCount === 0) {
      const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@123';
      const superadmin = new User({
        email: 'admin@cwfcorporation.com',
        password: adminPassword,
        role: 'superadmin',
        isActive: true,
      });
      await superadmin.save();
      console.log('[AutoSeed] Created superadmin account: admin@cwfcorporation.com');
    }

    // 2. Ensure SiteSettings exist
    const settingsCount = await SiteSettings.countDocuments({});
    if (settingsCount === 0) {
      await SiteSettings.create({
        companyPhone: '089561 17811',
        companyEmail: 'info@hbpolytech.com',
        address: {
          street: 'Office No. - 808, Sai Millenium, Mumbai Hwy, Kate Wasti, Punawale',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411033',
          country: 'India',
        },
        socialLinks: {
          instagram: 'https://www.instagram.com/hbpolytech?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
          linkedin: 'https://www.linkedin.com/in/hbpolytechind/',
        },
        businessHours: 'Tuesday - Sunday: 9:00 AM - 6:00 PM (Monday Closed)',
        aboutText: 'CWF Consulting Corporation Pune provides state of the art waterproofing consultation, structural diagnostics, and engineering audits.',
        certifications: [
          'ISO 9001:2015 Structural Safety Certified',
          'NACE Level 2 Coating Quality Audited',
          'Member of Waterproofing Association of India'
        ],
      });
    }

    // 3. Ensure SegmentInfo exist
    const segCount = await SegmentInfo.countDocuments({});
    if (segCount === 0) {
      await SegmentInfo.insertMany([
        {
          segment: 'civil',
          displayName: 'Civil Consulting',
          tagline: 'PROTECT • REPAIR • TRANSFORM',
          heroDescription: 'Specialized consulting and technical solutions for waterproofing, structural inspection, civil repairs, rehabilitation, restoration, quality assurance, and project supervision.',
          icon: 'ShieldAlert',
          order: 1,
        },
        {
          segment: 'web',
          displayName: 'Digital Solutions',
          tagline: 'CONNECT • DIGITALIZE • GROW',
          heroDescription: 'End-to-end digital solutions including website development, web and mobile applications, e-commerce, digital branding, marketing, CRM, and business automation.',
          icon: 'Code',
          order: 2,
        },
        {
          segment: 'finance',
          displayName: 'Financial & Wealth Solutions',
          tagline: 'PLAN • PROTECT • PROSPER',
          heroDescription: 'Comprehensive financial and wealth solutions covering investment planning, insurance, loans, risk profiling, financial planning, and portfolio guidance for individuals and businesses.',
          icon: 'TrendingUp',
          order: 3,
        },
      ]);
    }

    // 4. Populate Civil Services
    const civilCount = await CivilService.countDocuments({});
    if (civilCount === 0) {
      await CivilService.insertMany([
        {
          title: 'Waterproofing',
          slug: 'waterproofing',
          category: 'waterproofing',
          segment: 'civil',
          shortDescription: 'Comprehensive waterproofing diagnostics and structural sealing systems for complex properties.',
          fullDescription: '<p>We provide full structural moisture audits and design high-durability multi-layer waterproofing specifications for basements, terraces, bathrooms, and water tanks.</p>',
          coverImage: '/unsplash_9.jpg',
          gallery: ['/unsplash_9.jpg'],
          icon: 'droplet',
          isPublished: true,
          order: 1,
          warrantyYears: 5,
        },
        {
          title: 'Flooring',
          slug: 'flooring-systems',
          category: 'flooring',
          segment: 'civil',
          shortDescription: 'Epoxy, polyurethane, and specialized screed flooring for commercial and industrial zones.',
          fullDescription: '<p>Industrial flooring solutions designed for mechanical and chemical durability. We prepare substrates via grinding/blasting and apply heavy-duty epoxy coatings.</p>',
          coverImage: '/unsplash_24.jpg',
          gallery: ['/unsplash_24.jpg'],
          icon: 'layout',
          isPublished: true,
          order: 2,
          warrantyYears: 5,
        },
        {
          title: 'Landscaping',
          slug: 'corporate-landscaping',
          category: 'landscaping',
          segment: 'civil',
          shortDescription: 'Landscape design, garden layouts, and softscape execution for corporate sectors.',
          fullDescription: '<p>Bespoke landscape architecture integrating green zones, water bodies, and custom paving. We ensure drainage alignment and sustainable plant planning.</p>',
          coverImage: '/unsplash_17.jpg',
          gallery: ['/unsplash_17.jpg'],
          icon: 'trees',
          isPublished: true,
          order: 3,
          warrantyYears: 5,
        },
        {
          title: 'Painting',
          slug: 'professional-painting',
          category: 'painting',
          segment: 'civil',
          shortDescription: 'Premium exterior elastomeric coatings and interior decorative painting.',
          fullDescription: '<p>Standardized corporate and residential painting services. We utilize dust-free sanding machines, perform moisture tests, and apply long-lasting paint systems.</p>',
          coverImage: '/unsplash_21.jpg',
          gallery: ['/unsplash_21.jpg'],
          icon: 'brush',
          isPublished: true,
          order: 4,
          warrantyYears: 5,
        },
        {
          title: 'Structural & Civil Repairs',
          slug: 'structural-civil-repairs',
          category: 'repairs',
          segment: 'civil',
          shortDescription: 'Micro-concreting, structural polymer mortars, and crack injection repairs.',
          fullDescription: '<p>Restoring loading capacity to damaged concrete beams and columns. We perform rust removal, apply zinc-rich primers, and build profiles with non-shrink polymer repair mortars.</p>',
          coverImage: '/unsplash_8.jpg',
          gallery: ['/unsplash_8.jpg'],
          icon: 'hammer',
          isPublished: true,
          order: 5,
          warrantyYears: 5,
        },
        {
          title: 'Rehabilitation & Restoration',
          slug: 'rehabilitation-restoration',
          category: 'rehabilitation',
          segment: 'civil',
          shortDescription: 'Comprehensive restoration and strengthening of heritage and distressed buildings.',
          fullDescription: '<p>Detailed structural assessment and restoration schemes using fiber-reinforced polymers (FRP), carbon wraps, and chemical anchorage systems.</p>',
          coverImage: '/unsplash_11.jpg',
          gallery: ['/unsplash_11.jpg'],
          icon: 'wrench',
          isPublished: true,
          order: 6,
          warrantyYears: 5,
        },
        {
          title: 'Technical Inspection',
          slug: 'technical-inspection',
          category: 'inspection',
          segment: 'civil',
          shortDescription: 'Non-destructive testing (NDT), rebound hammer tests, and core drills.',
          fullDescription: '<p>Engineering diagnostics to evaluate concrete quality, reinforcement corrosion, and structural load limits. We provide complete audit reports with compliance certificates.</p>',
          coverImage: '/unsplash_15.jpg',
          gallery: ['/unsplash_15.jpg'],
          icon: 'clipboard-check',
          isPublished: true,
          order: 7,
          warrantyYears: 5,
        },
        {
          title: 'Quality Assurance',
          slug: 'quality-assurance-services',
          category: 'quality-assurance',
          segment: 'civil',
          shortDescription: 'Third-party quality auditing, materials testing, and site compliance tracking.',
          fullDescription: '<p>Ensuring site works match standards. We perform slump tests, cube tests, verify reinforcement steel grades, and audit concrete mix designs.</p>',
          coverImage: '/unsplash_1.jpg',
          gallery: ['/unsplash_1.jpg'],
          icon: 'shield',
          isPublished: true,
          order: 8,
          warrantyYears: 5,
        },
        {
          title: 'BOQ & Cost Estimation',
          slug: 'boq-cost-estimation',
          category: 'boq-estimation',
          segment: 'civil',
          shortDescription: 'Accurate quantity surveying, rate analysis, and material cost planning.',
          fullDescription: '<p>Drafting complete Bills of Quantities (BOQ), rate analysis logs, and cost estimations based on structural drawings to prevent project budget overruns.</p>',
          coverImage: '/unsplash_20.jpg',
          gallery: ['/unsplash_20.jpg'],
          icon: 'file-spreadsheet',
          isPublished: true,
          order: 9,
          warrantyYears: 5,
        },
        {
          title: 'Project & Application Supervision',
          slug: 'project-application-supervision',
          category: 'supervision',
          segment: 'civil',
          shortDescription: 'End-to-end execution supervision, timeline controls, and site coordination.',
          fullDescription: '<p>Expert site management and progress audits. We manage contractor schedules, enforce safety protocols, and ensure installation compliance with engineering specs.</p>',
          coverImage: '/unsplash_22.jpg',
          gallery: ['/unsplash_22.jpg'],
          icon: 'users',
          isPublished: true,
          order: 10,
          warrantyYears: 5,
        }
      ]);
    }

    // 5. Populate Web Services
    const webCount = await WebService.countDocuments({});
    if (webCount === 0) {
      await WebService.insertMany([
        {
          title: 'Website Development',
          slug: 'website-development-services',
          category: 'website-development',
          segment: 'web',
          shortDescription: 'Modern, responsive corporate websites crafted using React and Tailwind CSS.',
          fullDescription: '<p>We design and develop high-speed marketing websites tailored to your brand identity, optimized for all screen sizes and SEO performance.</p>',
          coverImage: '/unsplash_13.jpg',
          gallery: ['/unsplash_13.jpg'],
          icon: 'globe',
          isPublished: true,
          order: 1,
          techStack: ['React', 'Vite', 'TailwindCSS', 'Framer Motion'],
          projectTimeline: '3-5 weeks',
          pricingModel: 'fixed',
        },
        {
          title: 'Business Websites & Portals',
          slug: 'business-websites-portals',
          category: 'business-portals',
          segment: 'web',
          shortDescription: 'Secure client portals, custom intranets, and corporate web directories.',
          fullDescription: '<p>Custom-built corporate portals for document exchange, employee management, and client communication with strict access controls.</p>',
          coverImage: '/unsplash_7.jpg',
          gallery: ['/unsplash_7.jpg'],
          icon: 'layers',
          isPublished: true,
          order: 2,
          techStack: ['Next.js', 'Node.js', 'PostgreSQL', 'Auth0'],
          projectTimeline: '6-10 weeks',
          pricingModel: 'fixed',
        },
        {
          title: 'E-Commerce Solutions',
          slug: 'ecommerce-solutions-custom',
          category: 'ecommerce-solutions',
          segment: 'web',
          shortDescription: 'High-converting e-commerce web storefronts with shopping cart flows.',
          fullDescription: '<p>Custom retail shopping engines featuring inventory management, dynamic promo codes, tax calculators, and checkout funnels.</p>',
          coverImage: '/unsplash_4.jpg',
          gallery: ['/unsplash_4.jpg'],
          icon: 'shopping-bag',
          isPublished: true,
          order: 3,
          techStack: ['React', 'Node.js', 'Express', 'Stripe', 'MongoDB'],
          projectTimeline: '8-12 weeks',
          pricingModel: 'fixed',
        },
        {
          title: 'Mobile & Web Applications',
          slug: 'mobile-web-applications',
          category: 'mobile-apps',
          segment: 'web',
          shortDescription: 'Cross-platform React Native and Flutter mobile applications.',
          fullDescription: '<p>Bespoke native mobile apps for iOS and Android, paired with serverless backends and push notification modules.</p>',
          coverImage: '/unsplash_5.jpg',
          gallery: ['/unsplash_5.jpg'],
          icon: 'smartphone',
          isPublished: true,
          order: 4,
          techStack: ['React Native', 'Expo', 'Firebase', 'Node.js'],
          projectTimeline: '10-16 weeks',
          pricingModel: 'hourly',
        },
        {
          title: 'Digital Branding',
          slug: 'digital-branding-identity',
          category: 'digital-branding',
          segment: 'web',
          shortDescription: 'Corporate logo design, style guides, and digital visual identity bundles.',
          fullDescription: '<p>Formulating distinct visual identities including color tokens, typography scales, logo suites, and social media layout templates.</p>',
          coverImage: '/unsplash_6.jpg',
          gallery: ['/unsplash_6.jpg'],
          icon: 'palette',
          isPublished: true,
          order: 5,
          techStack: ['Figma', 'Adobe Illustrator', 'Photoshop'],
          projectTimeline: '2-4 weeks',
          pricingModel: 'fixed',
        },
        {
          title: 'Digital Marketing',
          slug: 'digital-marketing-campaigns',
          category: 'digital-marketing',
          segment: 'web',
          shortDescription: 'Search engine optimization (SEO), content strategy, and PPC advertising.',
          fullDescription: '<p>Strategic inbound marketing to drive leads, optimize conversion rates, and run high-yield search engine ads.</p>',
          coverImage: '/unsplash_3.jpg',
          gallery: ['/unsplash_3.jpg'],
          icon: 'trending-up',
          isPublished: true,
          order: 6,
          techStack: ['Google Ads', 'GA4', 'Semrush', 'Mailchimp'],
          projectTimeline: 'Ongoing',
          pricingModel: 'retainer',
        },
        {
          title: 'CRM & Business Automation',
          slug: 'crm-business-automation',
          category: 'crm-automation',
          segment: 'web',
          shortDescription: 'Automating custom leads capture, HubSpot sync, and sales pipelines.',
          fullDescription: '<p>Connecting web apps to popular CRMs, automating email workflows, invoicing APIs, and slack message notifications.</p>',
          coverImage: '/unsplash_0.jpg',
          gallery: ['/unsplash_0.jpg'],
          icon: 'cpu',
          isPublished: true,
          order: 7,
          techStack: ['Node.js', 'HubSpot API', 'Zapier', 'PostgreSQL'],
          projectTimeline: '4-8 weeks',
          pricingModel: 'fixed',
        },
        {
          title: 'Online Business Solutions',
          slug: 'online-business-solutions',
          category: 'online-solutions',
          segment: 'web',
          shortDescription: 'Strategic consulting on cloud architectures, DevOps pipelines, and scaling.',
          fullDescription: '<p>Consulting on cloud transitions, Kubernetes container management, CI/CD pipelines, and high-availability setups.</p>',
          coverImage: '/unsplash_14.jpg',
          gallery: ['/unsplash_14.jpg'],
          icon: 'cloud',
          isPublished: true,
          order: 8,
          techStack: ['AWS', 'Docker', 'Kubernetes', 'GitHub Actions'],
          projectTimeline: '6-12 weeks',
          pricingModel: 'hourly',
        }
      ]);
    }

    // 6. Populate Finance Services
    const finCount = await FinanceService.countDocuments({});
    if (finCount === 0) {
      await FinanceService.insertMany([
        {
          title: 'Investment Planning',
          slug: 'investment-planning-solutions',
          category: 'investment-planning',
          segment: 'finance',
          shortDescription: 'Goal-based tax-efficient investment structures and capital allocations.',
          fullDescription: '<p>Structuring customized investment portfolios mapping to target timelines, risk parameters, and liquidity profiles.</p>',
          coverImage: '/unsplash_10.jpg',
          gallery: ['/unsplash_10.jpg'],
          icon: 'briefcase',
          isPublished: true,
          order: 1,
          interestRateInfo: 'Fee-based guidance',
          eligibilityNotes: 'Suitable for individuals and trusts looking to allocate capital tax-efficiently.',
        },
        {
          title: 'Insurance Solutions',
          slug: 'corporate-insurance-solutions',
          category: 'insurance-solutions',
          segment: 'finance',
          shortDescription: 'Keyman insurance, corporate group health plans, and liability coverage.',
          fullDescription: '<p>Evaluating liability gaps and structuring corporate insurance, group medical protection, and liability coverages.</p>',
          coverImage: '/unsplash_23.jpg',
          gallery: ['/unsplash_23.jpg'],
          icon: 'shield',
          isPublished: true,
          order: 2,
          interestRateInfo: 'Standard insurance premiums',
          eligibilityNotes: 'Registered business entities, partnerships, and private firms in India.',
        },
        {
          title: 'Loan Assistance',
          slug: 'credit-loan-assistance',
          category: 'loan-assistance',
          segment: 'finance',
          shortDescription: 'Structured bank credit files for mortgages, LAP, and project loans.',
          fullDescription: '<p>End-to-end guidance in preparing loan proposals, compiling financial ratios, and coordinating approvals with partner banks.</p>',
          coverImage: '/unsplash_20.jpg',
          gallery: ['/unsplash_20.jpg'],
          icon: 'file-text',
          isPublished: true,
          order: 3,
          loanRangeMin: 1000000,
          loanRangeMax: 500000000,
          interestRateInfo: '8.5% - 13.5% p.a.',
          eligibilityNotes: 'Positive credit score (CIBIL > 700) and verifiable business/personal income.',
        },
        {
          title: 'NRI Corner',
          slug: 'nri-financial-corner',
          category: 'nri-corner',
          segment: 'finance',
          shortDescription: 'Financial advisory, NRE/NRO banking setup, and India tax filings for NRIs.',
          fullDescription: '<p>Specialized wealth planning and regulatory compliance consultations for Non-Resident Indians (NRIs) looking to invest in India.</p>',
          coverImage: '/unsplash_25.jpg',
          gallery: ['/unsplash_25.jpg'],
          icon: 'globe',
          isPublished: true,
          order: 4,
          interestRateInfo: 'Fee-based consultation',
          eligibilityNotes: 'Non-Resident Indians holding valid passport/OCI cards.',
        },
        {
          title: 'Behavioural Profiling',
          slug: 'behavioural-profiling-wealth',
          category: 'behavioural-profiling',
          segment: 'finance',
          shortDescription: 'Assessing client decision-making biases and financial temperaments.',
          fullDescription: '<p>Scientific analysis of investment patterns, cognitive biases, and spending temperaments to design aligned portfolios.</p>',
          coverImage: '/unsplash_12.jpg',
          gallery: ['/unsplash_12.jpg'],
          icon: 'user-check',
          isPublished: true,
          order: 5,
          interestRateInfo: 'Consulting-based advisory',
          eligibilityNotes: 'Available for individuals and corporate families during initial planning phase.',
        },
        {
          title: 'Risk Profiling',
          slug: 'risk-profiling-advisory',
          category: 'risk-profiling',
          segment: 'finance',
          shortDescription: 'Quantitative assessment of capital loss tolerance and market risk limits.',
          fullDescription: '<p>Evaluating portfolio volatility tolerance via standard scenario tests and asset-liability correlation audits.</p>',
          coverImage: '/unsplash_19.jpg',
          gallery: ['/unsplash_19.jpg'],
          icon: 'alert-triangle',
          isPublished: true,
          order: 6,
          interestRateInfo: 'Standard portfolio audit schedule',
          eligibilityNotes: 'Retail, HNW, and corporate investors holding active portfolios.',
        },
        {
          title: 'Financial Planning',
          slug: 'financial-planning-systems',
          category: 'financial-planning',
          segment: 'finance',
          shortDescription: 'Comprehensive family budgeting, estate planning, and retirement maps.',
          fullDescription: '<p>Designing total financial blueprints covering retirement reserves, cash management, and clean estate transitions.</p>',
          coverImage: '/unsplash_16.jpg',
          gallery: ['/unsplash_16.jpg'],
          icon: 'calendar',
          isPublished: true,
          order: 7,
          interestRateInfo: 'Fee or Retainer based',
          eligibilityNotes: 'Open for all individuals and small business owners seeking systematic planning.',
        },
        {
          title: 'Wealth & Portfolio Guidance',
          slug: 'wealth-portfolio-guidance',
          category: 'wealth-guidance',
          segment: 'finance',
          shortDescription: 'Strategic portfolio optimization, debt-equity audits, and asset allocations.',
          fullDescription: '<p>Periodic review of multi-asset portfolios to rebalance debt, equity, and alternative structures for maximum yield.</p>',
          coverImage: '/unsplash_2.jpg',
          gallery: ['/unsplash_2.jpg'],
          icon: 'activity',
          isPublished: true,
          order: 8,
          interestRateInfo: 'Fee-based (AUM percentage)',
          eligibilityNotes: 'Minimum investment volume of INR 25 Lakhs suggested.',
        }
      ]);
    }

    // 7. Populate Projects (Civil, Web, Finance)
    const cProjCount = await CivilProject.countDocuments({});
    if (cProjCount === 0) {
      await CivilProject.insertMany([
        {
          title: 'Terrace Slab Waterproofing & Leakage Repair',
          segment: 'civil',
          description: 'Forensic slab audit and polyurethane membrane treatment for a residential complex in Kothrud, Pune. Resolved active rainwater ceiling leakage.',
          coverImage: '/terrace_waterproofing.png',
          gallery: ['/terrace_waterproofing.png'],
          isFeatured: true,
          completionDate: new Date('2026-05-15'),
          location: 'Kothrud, Pune',
          clientType: 'residential',
          serviceCategory: 'waterproofing',
          beforeImages: ['/terrace_before.jpg'],
          afterImages: ['/terrace_waterproofing.png'],
          sqftTreated: 4200,
        },
        {
          title: 'Basement Retaining Wall Grouting',
          segment: 'civil',
          description: 'Hydrostatic pressure leakage halted using pressure polyurethane injection ports on retaining concrete walls of an IT Park basement.',
          coverImage: '/basement_grouting.jpg',
          gallery: ['/basement_grouting.jpg'],
          isFeatured: true,
          completionDate: new Date('2026-06-30'),
          location: 'Hinjawadi, Pune',
          clientType: 'commercial',
          serviceCategory: 'waterproofing',
          beforeImages: ['/unsplash_9.jpg'],
          afterImages: ['/basement_grouting.jpg'],
          sqftTreated: 8500,
        },
        {
          title: 'Industrial Epoxy Flooring Overhaul',
          segment: 'civil',
          description: 'Heavy-duty epoxy coating and substrate repair for a manufacturing facility warehouse in Hadapsar, Pune. Restored high chemical and mechanical load resistance.',
          coverImage: '/flooring_after.png',
          gallery: ['/flooring_after.png'],
          isFeatured: true,
          completionDate: new Date('2026-04-10'),
          location: 'Hadapsar, Pune',
          clientType: 'industrial',
          serviceCategory: 'flooring',
          beforeImages: ['/flooring_before.png'],
          afterImages: ['/flooring_after.png'],
          sqftTreated: 12500,
        }
      ]);
    }

    const wProjCount = await WebProject.countDocuments({});
    if (wProjCount === 0) {
      await WebProject.insertMany([
        {
          title: 'Global Agri-Export E-Commerce Portal',
          segment: 'web',
          description: 'Designed and engineered a high-volume B2B e-commerce platform for agricultural exporters, including multi-currency and real-time shipping APIs.',
          coverImage: '/unsplash_4.jpg',
          gallery: ['/unsplash_4.jpg'],
          isFeatured: true,
          completionDate: new Date('2026-05-15'),
          serviceCategory: 'e-commerce',
          liveUrl: 'https://agri-export-demo.com',
          techStack: ['React', 'Node.js', 'MongoDB', 'TailwindCSS', 'Redux Toolkit'],
        },
        {
          title: 'Pune FinTech SaaS Dashboard',
          segment: 'web',
          description: 'Engineered a secure financial analytics web interface featuring interactive SVG charts, dynamic risk profiling, and complex database transactions.',
          coverImage: '/unsplash_0.jpg',
          gallery: ['/unsplash_0.jpg'],
          isFeatured: true,
          completionDate: new Date('2026-06-30'),
          serviceCategory: 'web-app',
          liveUrl: 'https://fintech-saas-demo.com',
          techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
        },
        {
          title: 'High-Performance Next.js Corporate Portal',
          segment: 'web',
          description: 'Developed a fully static, fast corporate presence for a structural engineering firm. Built with optimized assets, next-gen images, and headless CMS integrations.',
          coverImage: '/unsplash_7.jpg',
          gallery: ['/unsplash_7.jpg'],
          isFeatured: false,
          completionDate: new Date('2026-07-15'),
          serviceCategory: 'corporate-site',
          liveUrl: 'https://corporate-next-demo.com',
          techStack: ['Next.js', 'React', 'TailwindCSS', 'Framer Motion', 'Sanity CMS'],
        }
      ]);
    }

    const fProjCount = await FinanceProject.countDocuments({});
    if (fProjCount === 0) {
      await FinanceProject.insertMany([
        {
          title: 'Debt Restructuring for Manufacturing Enterprise',
          segment: 'finance',
          description: 'Assisted a mid-market automotive components manufacturer in consolidating high-cost debts, re-negotiating covenant limits, and scaling repayment terms.',
          coverImage: '/unsplash_20.jpg',
          gallery: ['/unsplash_20.jpg'],
          isFeatured: true,
          completionDate: new Date('2026-05-15'),
          serviceCategory: 'working-capital',
          outcomeMetric: 'Saved INR 24 Lakhs annually in interest charges, restructured INR 8 Crores debt',
          clientIndustry: 'Automotive Components Manufacturing',
        },
        {
          title: 'Working Capital Optimisation & Funding Round',
          segment: 'finance',
          description: 'Facilitated cash credit limits and invoice discounting facilities for a major logistics provider during high expansion monsoons.',
          coverImage: '/unsplash_23.jpg',
          gallery: ['/unsplash_23.jpg'],
          isFeatured: true,
          completionDate: new Date('2026-06-30'),
          serviceCategory: 'working-capital',
          outcomeMetric: 'Secured INR 15 Crores working capital limit, improved cash conversion cycle by 18 days',
          clientIndustry: 'Logistics & Supply Chain Solutions',
        },
        {
          title: 'Corporate Tax Planning & Compliance Overhaul',
          segment: 'finance',
          description: 'Formulated a legally sound cross-state asset holding strategy for a hospital network to optimize depreciation deductions and compliance cycles.',
          coverImage: '/unsplash_10.jpg',
          gallery: ['/unsplash_10.jpg'],
          isFeatured: false,
          completionDate: new Date('2026-07-15'),
          serviceCategory: 'tax-consultancy',
          outcomeMetric: 'Reduced tax liability by 14% through legal deductions & compliant restructures',
          clientIndustry: 'Healthcare Services Provider',
        }
      ]);
    }

    // 8. Populate Blog Posts
    const blogCountActual = await BlogPost.countDocuments({});
    if (blogCountActual === 0) {
      const admin = await User.findOne({ role: 'superadmin' });
      const adminId = admin?._id;

      await BlogPost.insertMany([
        {
          title: 'Identifying Concrete Slab Leaks',
          slug: 'identifying-concrete-slab-leaks',
          content: '<p>Concrete slab cracking is an engineering challenge. Standard concrete is porous and naturally absorbs water pathways through capillary action. When expansion joints fail, dampness leaks into slab ceilings.</p><p>We recommend diagnostic thermal checks and moisture scans before applying sealants to ensure slab health.</p>',
          coverImage: '/unsplash_8.jpg',
          publishedAt: new Date('2026-07-20'),
          isPublished: true,
          author: adminId,
          seoTitle: 'Identify Concrete Slab Leaks | CWF Consulting Corp',
          seoDescription: 'Learn standard concrete leakage checks, expansion joint problems, and diagnostic scans from CWF engineering consultants.',
          tags: ['terrace', 'slab', 'concrete', 'inspection'],
          segment: 'civil',
        },
        {
          title: 'Negative Side Waterproofing Explained',
          slug: 'negative-side-waterproofing-explained',
          content: '<p>Negative-side waterproofing blocks water ingress from the internal face of a retaining wall. This is critical for basements in high-groundwater zones like Hinjawadi and Pune suburbs.</p><p>Using crystalline coatings that react with concrete moisture to block microscopic capillaries is standard engineering practice here.</p>',
          coverImage: '/unsplash_9.jpg',
          publishedAt: new Date('2026-07-25'),
          isPublished: true,
          author: adminId,
          seoTitle: 'Negative Side Waterproofing | CWF Consulting Corp',
          seoDescription: 'Understand the engineering science of negative side crystalline slurry and PU injection for basements.',
          tags: ['basement', 'crystalline', 'retaining-wall', 'grouting'],
          segment: 'civil',
        },
        {
          title: 'Modern Scaling Strategies for Enterprise Apps',
          slug: 'scaling-enterprise-apps-nodejs',
          content: '<p>Scalability starts at the architectural level. By offloading resource-heavy computations to background workers and utilizing Redis caches, Node.js APIs can handle thousands of concurrent requests seamlessly.</p>',
          coverImage: '/unsplash_0.jpg',
          publishedAt: new Date('2026-08-01'),
          isPublished: true,
          author: adminId,
          seoTitle: 'Scaling Node.js REST APIs | CWF Web',
          seoDescription: 'Learn caching, database connection pooling, and queue strategies for backend software scaling.',
          tags: ['scaling', 'nodejs', 'web-app', 'caching'],
          segment: 'web',
        },
        {
          title: 'Choosing a Modern CMS: Headless vs Traditional',
          slug: 'headless-vs-traditional-cms',
          content: '<p>Selecting a Content Management System directly affects page speeds and editing experiences. Headless CMS engines decouple your content from the presentation layer, delivering JSON data over secure APIs.</p><p>We recommend React frontends paired with Strapi or Sanity for high-growth corporate websites in Pune.</p>',
          coverImage: '/unsplash_13.jpg',
          publishedAt: new Date('2026-08-05'),
          isPublished: true,
          author: adminId,
          seoTitle: 'Headless CMS vs Traditional CMS | CWF Web',
          seoDescription: 'Analyse the security, speed, and editor experience differences between headless and legacy monolithic CMS setups.',
          tags: ['cms', 'headless', 'nextjs', 'web-dev'],
          segment: 'web',
        },
        {
          title: 'Understanding Working Capital Loans for SMEs',
          slug: 'working-capital-loans-smes',
          content: '<p>SMEs frequently face cash conversion cycle challenges. A structured Working Capital loan or Cash Credit (CC) limit provides liquidity to bridge vendor payment cycles and dynamic payroll gaps.</p><p>Preparing a cash flow analysis statement is the first essential step in assessing credit lines.</p>',
          coverImage: '/unsplash_23.jpg',
          publishedAt: new Date('2026-08-10'),
          isPublished: true,
          author: adminId,
          seoTitle: 'SME Working Capital Overdraft CC Limits | CWF Finance',
          seoDescription: 'Learn how to structure working capital limits and manage cash conversion cycles for business liquidity.',
          tags: ['working-capital', 'sme', 'cash-credit', 'debt-advisory'],
          segment: 'finance',
        },
        {
          title: 'Tax Planning Checklist for Indian Businesses in FY 2026',
          slug: 'tax-planning-checklist-fy-2026',
          content: '<p>Effective corporate tax planning requires proactive structuring of business deductions, depreciation allowances, and compliance checks. Preparing documentation before Q4 minimizes year-end adjustment audit liabilities.</p><p>Consulting with certified corporate tax advisors ensures alignment with newer taxation circulars.</p>',
          coverImage: '/unsplash_20.jpg',
          publishedAt: new Date('2026-08-15'),
          isPublished: true,
          author: adminId,
          seoTitle: 'Corporate Tax Planning Checklist FY 2026 | CWF Finance',
          seoDescription: 'A practical tax-compliance review guide for SME directors, covering deductions and audit preparedness.',
          tags: ['taxation', 'compliance', 'corporate-tax', 'audit'],
          segment: 'finance',
        },
        {
          title: 'How to Prepare for a Business Loan Application',
          slug: 'prepare-business-loan-application',
          content: '<p>Securing competitive bank funding margins requires presenting a healthy debt service coverage ratio (DSCR). Banks inspect CMA data sheets, credit histories (CIBIL details), and asset valuation reports.</p><p>We guide SME directors through CMA structuring to speed up loan approvals.</p>',
          coverImage: '/unsplash_10.jpg',
          publishedAt: new Date('2026-08-20'),
          isPublished: true,
          author: adminId,
          seoTitle: 'Preparing Business Loan Applications & CMA | CWF Finance',
          seoDescription: 'Avoid bank rejection by organizing CMA metrics, credit scores, and collateral valuations.',
          tags: ['business-loan', 'debt-advisory', 'dscr', 'cma-data'],
          segment: 'finance',
        }
      ]);
    }

    console.log('[AutoSeed] Successfully populated all missing divisions, services, projects, and blogs in MongoDB.');
  } catch (err) {
    console.error(`[AutoSeed] Warning: autoSeed failed: ${err.message}`);
  }
};
