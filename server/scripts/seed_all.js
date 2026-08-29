import mongoose from 'mongoose';
import dotenv from 'dotenv';
import crypto from 'crypto';
import User from '../src/models/User.js';
import SiteSettings from '../src/models/SiteSettings.js';
import SegmentInfo from '../src/models/SegmentInfo.js';
import Service, { CivilService, WebService, FinanceService } from '../src/models/Service.js';
import Project, { CivilProject, WebProject, FinanceProject } from '../src/models/Project.js';
import BlogPost from '../src/models/BlogPost.js';
import Testimonial from '../src/models/Testimonial.js';
import TeamMember from '../src/models/TeamMember.js';
import Inquiry from '../src/models/Inquiry.js';
import dns from 'dns';

// Force DNS servers to Google DNS only on Windows hosts to bypass local router SRV resolution limitations
if (process.platform === 'win32') {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cwf_corporation';

const seedAll = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(MONGO_URI);
    console.log('Database connected successfully.');

    // Clean existing collections
    console.log('Clearing existing data collections...');
    await User.deleteMany({});
    await SiteSettings.deleteMany({});
    await SegmentInfo.deleteMany({});
    await Service.deleteMany({});
    await Project.deleteMany({});
    await BlogPost.deleteMany({});
    await Testimonial.deleteMany({});
    await TeamMember.deleteMany({});
    await Inquiry.deleteMany({});

    console.log('Data cleared.');

    // 1. Seed Staff Users (Superadmin + Editors)
    console.log('Seeding staff accounts...');
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@123';
    
    const superadmin = new User({
      email: 'admin@cwfcorporation.com',
      password: adminPassword,
      role: 'superadmin',
      isActive: true,
    });
    await superadmin.save();

    const editor1 = new User({
      email: 'editor@cwfcorporation.com',
      password: 'EditorPassword123!',
      role: 'editor',
      isActive: true,
    });
    await editor1.save();

    const editor2 = new User({
      email: 'estimator@cwfcorporation.com',
      password: 'EstimatorPassword123!',
      role: 'editor',
      isActive: true,
    });
    await editor2.save();

    console.log('\n==================================================');
    console.log('          SEEDED STAFF USER ACCOUNTS              ');
    console.log('--------------------------------------------------');
    console.log('1. Superadmin:   admin@cwfcorporation.com  [Admin@123]');
    console.log('2. Editor:       editor@cwfcorporation.com [EditorPassword123!]');
    console.log('3. Estimator:    estimator@cwfcorporation.com [EstimatorPassword123!]');
    console.log('==================================================\n');

    // 2. Seed Site Settings
    const settings = await SiteSettings.create({
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
    console.log('SiteSettings seeded successfully.');

    // 3. Seed SegmentInfo
    console.log('Seeding SegmentInfo documents...');
    const segmentsData = [
      {
        segment: 'civil',
        displayName: 'Civil & Waterproofing',
        tagline: 'Scientific Waterproofing Diagnostics & Structural Integrity Supervision',
        heroDescription: 'We provide forensic moisture scanning, structural concrete inspections, and high-performance sealing systems to protect structures from water ingress and reinforcements from corrosion.',
        icon: 'ShieldAlert',
        order: 1,
      },
      {
        segment: 'web',
        displayName: 'Software & Web Development',
        tagline: 'High-Performance React/Next.js Platforms & Enterprise Cloud Applications',
        heroDescription: 'We engineer secure, scalable, and responsive React/Node.js web applications, e-commerce engines, and bespoke custom software solutions tailored for modern businesses.',
        icon: 'Code',
        order: 2,
      },
      {
        segment: 'finance',
        displayName: 'Financial Advisory & Corporate Planning',
        tagline: 'PLAN • PROTECT • PROSPER',
        heroDescription: 'Strategic Corporate Debt Advisory, Working Capital Solutions & Tax Planning. Maximize your business growth with expert structural corporate tax planning, working capital solutions, and debt-advisory services.',
        icon: 'TrendingUp',
        order: 3,
      },
    ];
    await SegmentInfo.insertMany(segmentsData);
    console.log('Seeded SegmentInfo records successfully.');

    // 4. Seed Services (Civil, Web, and Finance)
    console.log('Seeding service categories...');
    
    // 4a. Civil Services
    const civilServices = [
      {
        title: 'Terrace Waterproofing',
        slug: 'terrace-waterproofing',
        category: 'terrace',
        segment: 'civil',
        shortDescription: 'Forensic audits and multi-layer polyurethane coatings to seal slab fractures and joint entries.',
        fullDescription: '<p>Terraces in Pune face intense temperature changes and heavy monsoon rainfall, causing micro-fractures in concrete slabs. Our inspection starts with moisture meters and thermal imaging to locate water ingress pathways.</p><p>We specify double-layer polyurethane lining coupled with polymer modified mortar joint repairs to provide long-term structural safety.</p>',
        coverImage: '/terrace_waterproofing.webp',
        gallery: ['/terrace_waterproofing.webp'],
        icon: 'droplet',
        isPublished: true,
        order: 1,
        warrantyYears: 5,
      },
      {
        title: 'Basement Waterproofing & Grouting',
        slug: 'basement-waterproofing',
        category: 'basement',
        segment: 'civil',
        shortDescription: 'Pressure injection grouting and negative-side crystalline lining to block hydrostatic groundwater pressure.',
        fullDescription: '<p>High water tables in Pune during the monsoon put immense hydrostatic pressure on retaining walls. We perform non-destructive concrete scanning and core drills to evaluate moisture paths.</p><p>We inject low-viscosity polyurethane expanding grouts into fissures and apply specialized crystalline slurry coatings on retaining wall faces.</p>',
        coverImage: '/basement_grouting.webp',
        gallery: ['/basement_grouting.webp'],
        icon: 'shield',
        isPublished: true,
        order: 2,
        warrantyYears: 8,
      },
      {
        title: 'Bathroom Wet Area Sealing',
        slug: 'bathroom-waterproofing',
        category: 'bathroom',
        segment: 'civil',
        shortDescription: 'Leak diagnostics for drain traps, tile joints, and pipes, followed by high-grade under-tile membranes.',
        fullDescription: '<p>Failure of bathroom waterproofing causes damp patches on ceiling slabs below. We perform dye-testing and drain-line visual scoping to identify leakage sources.</p><p>Our solutions include laying heavy-duty elastomeric acrylic membranes and re-filling joint tiles with chemical-resistant epoxy sealants.</p>',
        coverImage: '/bathroom_sealing.webp',
        gallery: ['/bathroom_sealing.webp'],
        icon: 'bath',
        isPublished: true,
        order: 3,
        warrantyYears: 5,
      },
      {
        title: 'Clean Water Tank Lining',
        slug: 'water-tank-sealing',
        category: 'tank',
        segment: 'civil',
        shortDescription: 'Food-grade, non-toxic epoxy linings and internal sanitization for concrete drinking water reservoirs.',
        fullDescription: '<p>Cracked water tanks lose thousands of liters daily and suffer from reinforcement corrosion. We scrape and sanitize internal walls, apply food-grade, non-toxic epoxy linings, and reinforce structural joints with non-shrink grout.</p>',
        coverImage: '/water_tank.webp',
        gallery: ['/water_tank.webp'],
        icon: 'database',
        isPublished: true,
        order: 4,
        warrantyYears: 3,
      },
      {
        title: 'Exterior Wall Facade Protection',
        slug: 'facade-sealing',
        category: 'facade',
        segment: 'civil',
        shortDescription: 'Hydrophobic silane-siloxane exterior wall sprays and elastomeric paint coatings to seal rain micro-cracks.',
        fullDescription: '<p>Wind-driven monsoons force rainwater through plaster micro-cracks, causing internal dampness. We apply breathable, hydrophobic silane-siloxane sprays and flexible elastomeric coatings that span active hairline fractures.</p>',
        coverImage: '/exterior_facade.webp',
        gallery: ['/exterior_facade.webp'],
        icon: 'home',
        isPublished: true,
        order: 5,
        warrantyYears: 5,
      },
      {
        title: 'PU Injection Crack Grouting',
        slug: 'injection-grouting',
        category: 'injection-grouting',
        segment: 'civil',
        shortDescription: 'Pressure injection of reactive polyurethane resins into structural cracks to form instant water-tight foam seals.',
        fullDescription: '<p>For active leaks in concrete slabs or joints, we drill and install packers to inject low-viscosity PU resins. These react with moisture, expanding up to 20 times their volume to form a resilient, flexible water-tight foam seal inside the concrete structure.</p>',
        coverImage: '/injection_grouting.webp',
        gallery: ['/injection_grouting.webp'],
        icon: 'wrench',
        isPublished: true,
        order: 6,
        warrantyYears: 3,
      }
    ];
    await CivilService.insertMany(civilServices);

    // 4b. Web Services
    const webServices = [
      {
        title: 'E-Commerce Platform Engineering',
        slug: 'ecommerce-platform-engineering',
        category: 'e-commerce',
        segment: 'web',
        shortDescription: 'Robust B2B/B2C e-commerce web applications featuring secure transactions and inventory sync.',
        fullDescription: '<p>We build highly transactional e-commerce engines designed to drive conversions. Our portals include customized product listing grids, multi-channel cart integrations, and real-time inventory management dashboards.</p><p>We integrate secure gateways such as Razorpay, Stripe, and PayPal to enable frictionless transactions with full database audit trails.</p>',
        coverImage: '/web_ecommerce.webp',
        gallery: ['/web_ecommerce.webp'],
        icon: 'shopping-cart',
        isPublished: true,
        order: 1,
        techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'Redux Toolkit', 'TailwindCSS'],
        projectTimeline: '8-12 weeks',
        pricingModel: 'fixed',
      },
      {
        title: 'Corporate Website Development',
        slug: 'corporate-website-development',
        category: 'corporate-site',
        segment: 'web',
        shortDescription: 'Fast, secure, and SEO-optimized marketing web hubs crafted with Next.js and headless CMS.',
        fullDescription: '<p>CWF Web builds premium corporate websites that act as high-conversion marketing funnels. We leverage Next.js to deliver server-side rendering (SSR) and static site generation (SSG) for sub-second load times.</p><p>Client contents are integrated with robust Headless CMS systems (like Sanity, Strapi, or Contentful) allowing internal staff to update portfolios and case studies instantly.</p>',
        coverImage: '/web_corporate.webp',
        gallery: ['/web_corporate.webp'],
        icon: 'globe',
        isPublished: true,
        order: 2,
        techStack: ['Next.js', 'React', 'TailwindCSS', 'Framer Motion', 'Sanity CMS', 'Vercel'],
        projectTimeline: '4-6 weeks',
        pricingModel: 'fixed',
      },
      {
        title: 'Enterprise Web Application Development',
        slug: 'enterprise-web-application',
        category: 'web-app',
        segment: 'web',
        shortDescription: 'Bespoke, secure SaaS web platforms engineered for business process automation and scaling.',
        fullDescription: '<p>We develop complex web applications featuring interactive dashboards, multi-user role security layers, and secure database backends. Our architectures are built for horizontal scaling under cloud environments.</p><p>Ideal for client portals, CRM systems, custom inventory tracking, and programmatic data reporting tools.</p>',
        coverImage: '/web_app.webp',
        gallery: ['/web_app.webp'],
        icon: 'cpu',
        isPublished: true,
        order: 3,
        techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Sequelize', 'Docker', 'AWS'],
        projectTimeline: '12-16 weeks',
        pricingModel: 'hourly',
      },
      {
        title: 'SEO & Platform Maintenance Retainer',
        slug: 'seo-maintenance-retainer',
        category: 'seo-maintenance',
        segment: 'web',
        shortDescription: 'Continuous technical search engine optimization, bug fixing, analytics, and security audits.',
        fullDescription: '<p>A website requires continuous maintenance to remain rank-worthy and secure. Our monthly retainer service includes monitoring Core Web Vitals, fixing crawl errors, updating packages, and patch deployment.</p><p>We configure continuous telemetry logs (Sentry/Winston) and present monthly growth charts covering keyword impressions and speed index audits.</p>',
        coverImage: '/web_maintenance.webp',
        gallery: ['/web_maintenance.webp'],
        icon: 'settings',
        isPublished: true,
        order: 4,
        techStack: ['Google Analytics 4', 'Semrush', 'Google Search Console', 'Sentry', 'Node.js'],
        projectTimeline: 'Ongoing (Monthly)',
        pricingModel: 'retainer',
      },
      {
        title: 'Custom Software Integration & APIs',
        slug: 'custom-software-development',
        category: 'custom-development',
        segment: 'web',
        shortDescription: 'Bespoke backend APIs, third-party software syncs, and microservice engineering.',
        fullDescription: '<p>We build lightweight, concurrent microservices and customized API layers to bridge disjoint legacy software. We prioritize high-speed communication and strict payload verification to prevent data discrepancies.</p>',
        coverImage: '/web_custom.webp',
        gallery: ['/web_custom.webp'],
        icon: 'code',
        isPublished: true,
        order: 5,
        techStack: ['Go', 'Python', 'FastAPI', 'gRPC', 'Kubernetes', 'Google Cloud Platform'],
        projectTimeline: '16-24 weeks',
        pricingModel: 'hourly',
      }
    ];
    await WebService.insertMany(webServices);

    // 4c. Finance Services
    const financeServices = [
      {
        title: 'Business Growth Loan Consultancy',
        slug: 'business-loan-consultancy',
        category: 'business-loan',
        segment: 'finance',
        shortDescription: 'Securing corporate expansion funds, machinery loans, and term funding from major lenders.',
        fullDescription: '<p>We assist SMEs and Corporates in restructuring balance sheets and presenting structured proposals to leading banking partners. Our team ensures that client enterprises receive optimal term funding rates.</p><p>We coordinate documentation from CMA data construction, cash flow projection checks, to file approval.</p>',
        coverImage: '/fin_business.webp',
        gallery: ['/fin_business.webp'],
        icon: 'trending-up',
        isPublished: true,
        order: 1,
        loanRangeMin: 1000000,
        loanRangeMax: 50000000,
        interestRateInfo: '9.5% - 14% p.a. (Fixed or Floating)',
        eligibilityNotes: 'Minimum 2 years of business vintage, Audited financial statements, and positive GST returns history.',
      },
      {
        title: 'Structured Working Capital Solutions',
        slug: 'working-capital-solutions',
        category: 'working-capital',
        segment: 'finance',
        shortDescription: 'Factoring, bill discounting, and cash credit structures to optimize corporate liquidity.',
        fullDescription: '<p>Cash flow timing gaps can stall business progress. We structure asset-backed working capital facilities, including overdrafts (OD), cash credit limits (CC), and trade finance structures like Letters of Credit (LC) and Bank Guarantees (BG).</p><p>Optimise your debtor conversion cycles and build cash reserves to capture vendor purchase discounts.</p>',
        coverImage: '/fin_capital.webp',
        gallery: ['/fin_capital.webp'],
        icon: 'dollar-sign',
        isPublished: true,
        order: 2,
        loanRangeMin: 5000000,
        loanRangeMax: 100000000,
        interestRateInfo: '8.75% - 12% p.a.',
        eligibilityNotes: 'Positive EBITDA for 2 consecutive years, hypothecation of stock & debtors.',
      },
      {
        title: 'High-Net-Worth Investment Advisory',
        slug: 'investment-advisory-services',
        category: 'investment-advisory',
        segment: 'finance',
        shortDescription: 'Bespoke asset allocation strategies, mutual funds audits, and strategic PMS consulting.',
        fullDescription: '<p>We design customized, goal-oriented wealth preservation roadmaps. Our audits evaluate tax-efficient yields, risk metrics, and correlation coefficients across asset classes.</p><p>We provide advisory across mutual funds, debt securities, and Portfolio Management Services (PMS).</p>',
        coverImage: '/fin_invest.webp',
        gallery: ['/fin_invest.webp'],
        icon: 'briefcase',
        isPublished: true,
        order: 3,
        loanRangeMin: null,
        loanRangeMax: null,
        interestRateInfo: 'Fee-based (0.5% - 1.5% AUM p.a.)',
        eligibilityNotes: 'Minimum investible surplus of INR 50 Lakhs.',
      },
      {
        title: 'Corporate Tax Planning & Audit Representation',
        slug: 'corporate-tax-planning',
        category: 'tax-consultancy',
        segment: 'finance',
        shortDescription: 'Legitimate tax liability reduction, corporate restructures, and representation in audits.',
        fullDescription: '<p>Our experts design tax structures that ensure full compliance with the Income Tax Act and GST regulations while maximizing corporate deductions. We represent firms during income tax assessments, appeals, and audit filings.</p>',
        coverImage: '/fin_tax.webp',
        gallery: ['/fin_tax.webp'],
        icon: 'file-text',
        isPublished: true,
        order: 4,
        loanRangeMin: null,
        loanRangeMax: null,
        interestRateInfo: 'Retainer or Project-based billing',
        eligibilityNotes: 'SMEs, partnerships, and private limited companies operating in India.',
      },
      {
        title: 'Personal Loan & Debt Consolidation Advisory',
        slug: 'personal-loan-advisory',
        category: 'personal-loan',
        segment: 'finance',
        shortDescription: 'Tailored assistance to secure competitive personal funding and consolidate high-cost debt.',
        fullDescription: '<p>For executives and salaried professionals seeking clean debt. We scan and present optimal personal loan products across 15+ partner banks, advising on consolidation strategies to reduce dynamic interest margins.</p>',
        coverImage: '/fin_personal.webp',
        gallery: ['/fin_personal.webp'],
        icon: 'user-check',
        isPublished: true,
        order: 5,
        loanRangeMin: 100000,
        loanRangeMax: 5000000,
        interestRateInfo: '10.5% - 16% p.a.',
        eligibilityNotes: 'Salaried individuals with minimum net monthly salary of INR 35,000 and CIBIL score > 750.',
      }
    ];
    await FinanceService.insertMany(financeServices);
    console.log('Seeded services for all segments successfully.');

    // 5. Seed Projects (Civil, Web, and Finance)
    console.log('Seeding portfolio projects / case studies...');
    
    // 5a. Civil Projects
    const civilProjects = [
      {
        title: 'Terrace Slab Waterproofing & Leakage Repair',
        segment: 'civil',
        description: 'Forensic slab audit and polyurethane membrane treatment for a residential complex in Kothrud, Pune. Resolved active rainwater ceiling leakage.',
        coverImage: '/terrace_waterproofing.webp',
        gallery: ['/terrace_waterproofing.webp'],
        isFeatured: true,
        completionDate: new Date('2026-05-15'),
        location: 'Kothrud, Pune',
        clientType: 'residential',
        serviceCategory: 'terrace',
        beforeImages: ['/terrace_before.webp'],
        afterImages: ['/terrace_waterproofing.webp'],
        sqftTreated: 4200,
      },
      {
        title: 'Basement Retaining Wall Grouting',
        segment: 'civil',
        description: 'Hydrostatic pressure leakage halted using pressure polyurethane injection ports on retaining concrete walls of an IT Park basement.',
        coverImage: '/basement_grouting.webp',
        gallery: ['/basement_grouting.webp'],
        isFeatured: true,
        completionDate: new Date('2026-06-30'),
        location: 'Hinjawadi, Pune',
        clientType: 'commercial',
        serviceCategory: 'basement',
        beforeImages: ['/terrace_before.webp'],
        afterImages: ['/basement_grouting.webp'],
        sqftTreated: 8500,
      },
      {
        title: 'Industrial Tank Epoxy Rehabilitation',
        segment: 'civil',
        description: 'Completed food-grade epoxy lining, concrete patch repairs, and structural joint grouting for a pharmaceutical factory drinking reservoir.',
        coverImage: '/water_tank.webp',
        gallery: ['/water_tank.webp'],
        isFeatured: true,
        completionDate: new Date('2026-04-10'),
        location: 'Hadapsar, Pune',
        clientType: 'industrial',
        serviceCategory: 'tank',
        beforeImages: ['/terrace_before.webp'],
        afterImages: ['/water_tank.webp'],
        sqftTreated: 3200,
      }
    ];
    await CivilProject.insertMany(civilProjects);

    // 5b. Web Projects
    const webProjects = [
      {
        title: 'Global Agri-Export E-Commerce Portal',
        segment: 'web',
        description: 'Designed and engineered a high-volume B2B e-commerce platform for agricultural exporters, including multi-currency and real-time shipping APIs.',
        coverImage: '/web_proj_agri.webp',
        gallery: ['/web_proj_agri.webp'],
        isFeatured: true,
        completionDate: new Date('2026-05-15'),
        liveUrl: 'https://agri-export-demo.com',
        techStack: ['React', 'Node.js', 'MongoDB', 'TailwindCSS', 'Redux Toolkit'],
      },
      {
        title: 'Pune FinTech SaaS Dashboard',
        segment: 'web',
        description: 'Engineered a secure financial analytics web interface featuring interactive SVG charts, dynamic risk profiling, and complex database transactions.',
        coverImage: '/web_proj_fintech.webp',
        gallery: ['/web_proj_fintech.webp'],
        isFeatured: true,
        completionDate: new Date('2026-06-30'),
        liveUrl: 'https://fintech-saas-demo.com',
        techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
      },
      {
        title: 'High-Performance Next.js Corporate Portal',
        segment: 'web',
        description: 'Developed a fully static, fast corporate presence for a structural engineering firm. Built with optimized assets, next-gen images, and headless CMS integrations.',
        coverImage: '/web_proj_corporate.webp',
        gallery: ['/web_proj_corporate.webp'],
        isFeatured: false,
        completionDate: new Date('2026-07-15'),
        liveUrl: 'https://corporate-next-demo.com',
        techStack: ['Next.js', 'React', 'TailwindCSS', 'Framer Motion', 'Sanity CMS'],
      }
    ];
    await WebProject.insertMany(webProjects);

    // 5c. Finance Projects (Case studies with outcomes)
    const financeProjects = [
      {
        title: 'Debt Restructuring for Manufacturing Enterprise',
        segment: 'finance',
        description: 'Assisted a mid-market automotive components manufacturer in consolidating high-cost debts, re-negotiating covenant limits, and scaling repayment terms.',
        coverImage: '/fin_proj_manufacturing.webp',
        gallery: ['/fin_proj_manufacturing.webp'],
        isFeatured: true,
        completionDate: new Date('2026-05-15'),
        outcomeMetric: 'Saved INR 24 Lakhs annually in interest charges, restructured INR 8 Crores debt',
        clientIndustry: 'Automotive Components Manufacturing',
      },
      {
        title: 'Working Capital Optimisation & Funding Round',
        segment: 'finance',
        description: 'Facilitated cash credit limits and invoice discounting facilities for a major logistics provider during high expansion monsoons.',
        coverImage: '/fin_proj_logistics.webp',
        gallery: ['/fin_proj_logistics.webp'],
        isFeatured: true,
        completionDate: new Date('2026-06-30'),
        outcomeMetric: 'Secured INR 15 Crores working capital limit, improved cash conversion cycle by 18 days',
        clientIndustry: 'Logistics & Supply Chain Solutions',
      },
      {
        title: 'Corporate Tax Planning & Compliance Overhaul',
        segment: 'finance',
        description: 'Formulated a legally sound cross-state asset holding strategy for a hospital network to optimize depreciation deductions and compliance cycles.',
        coverImage: '/fin_proj_healthcare.webp',
        gallery: ['/fin_proj_healthcare.webp'],
        isFeatured: false,
        completionDate: new Date('2026-07-15'),
        outcomeMetric: 'Reduced tax liability by 14% through legal deductions & compliant restructures',
        clientIndustry: 'Healthcare Services Provider',
      }
    ];
    await FinanceProject.insertMany(financeProjects);
    console.log('Seeded projects for all segments successfully.');

    // 6. Seed Testimonials (Civil, Web, and Finance)
    console.log('Seeding client reviews...');
    const testimonialsData = [
      {
        clientName: 'Rajesh Patil',
        clientType: 'residential',
        segment: 'civil',
        rating: 5,
        text: 'The diagnostic audit was extremely detailed. CWF engineers found leakage paths standard contractors missed. Their polyurethane prescription completely solved our terrace issue.',
        photo: 'https://res.cloudinary.com/demo/image/upload/w_100,h_100/sample.jpg',
        isPublished: true,
      },
      {
        clientName: 'Amit Shah',
        clientType: 'commercial',
        segment: 'civil',
        rating: 5,
        text: 'Outstanding technical supervision. Their site engineer verified every coat layer thickness and material mix. Highly recommend for commercial waterproofing.',
        photo: 'https://res.cloudinary.com/demo/image/upload/w_100,h_100/sample.jpg',
        isPublished: true,
      },
      {
        clientName: 'Siddharth Goel',
        clientType: 'commercial',
        segment: 'web',
        rating: 5,
        text: 'CWF\'s web division developed our logistics tracking app. It handles 5,000+ daily orders flawlessly. Responsive and highly skilled engineering team.',
        photo: 'https://res.cloudinary.com/demo/image/upload/w_100,h_100/sample.jpg',
        isPublished: true,
      },
      {
        clientName: 'Neha Ranade',
        clientType: 'individual',
        segment: 'web',
        rating: 5,
        text: 'Their custom Next.js e-commerce setup boosted our mobile conversion rate by 35%. Excellent post-launch SEO retainer support.',
        photo: 'https://res.cloudinary.com/demo/image/upload/w_100,h_100/sample.jpg',
        isPublished: true,
      },
      {
        clientName: 'Milind Deshpande',
        clientType: 'commercial',
        segment: 'finance',
        rating: 5,
        text: 'CWF\'s corporate finance advisors successfully restructured our business debt. The interest savings directly funded our factory expansion.',
        photo: 'https://res.cloudinary.com/demo/image/upload/w_100,h_100/sample.jpg',
        isPublished: true,
      },
      {
        clientName: 'Pranali Shah',
        clientType: 'individual',
        segment: 'finance',
        rating: 5,
        text: 'Their working capital solutions solved our cash flow crunch. Highly professional team with direct contacts in top commercial banks.',
        photo: 'https://res.cloudinary.com/demo/image/upload/w_100,h_100/sample.jpg',
        isPublished: true,
      }
    ];
    await Testimonial.insertMany(testimonialsData);
    console.log('Seeded testimonials successfully.');

    // 7. Seed Team Members (Symmetric / Specialised with shared leadership)
    console.log('Seeding team member profiles...');
    const teamData = [
      {
        name: 'Vikram Shinde',
        designation: 'Co-Founder & Principal Consultant',
        photo: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_fill/sample.jpg',
        bio: 'Civil Engineer and management head supervising diagnostic methodologies across engineering audits, corporate finance integrations, and operations.',
        // ASSUMPTION - CONFIRM WITH CLIENT: Vikram Shinde has been seeded as a shared resource across all 
        // 3 verticals (civil, web, finance). Confirm whether client leadership spans all three.
        segments: ['civil', 'web', 'finance'],
        order: 1,
      },
      {
        name: 'Priya Joshi',
        designation: 'Structural Diagnostics Specialist',
        photo: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_fill/sample.jpg',
        bio: 'Expert in non-destructive thermal mapping and slab moisture scan audits.',
        segments: ['civil'],
        order: 2,
      },
      {
        name: 'Rohan Mehta',
        designation: 'Principal Software Architect',
        photo: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_fill/sample.jpg',
        bio: 'Full Stack engineer with 8 years experience building large scale React/Node.js products and SaaS integrations.',
        segments: ['web'],
        order: 3,
      },
      {
        name: 'Sneha Ranade',
        designation: 'Corporate Finance Lead Advisor',
        photo: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_fill/sample.jpg',
        bio: 'Chartered Accountant specializing in SME debt facilitation, working capital planning, and tax representations.',
        segments: ['finance'],
        order: 4,
      }
    ];
    await TeamMember.insertMany(teamData);
    console.log('Seeded team members successfully.');

    // 8. Seed Blog Posts (Civil and General)
    console.log('Seeding blog articles...');
    const blogData = [
      {
        title: 'Identifying Concrete Slab Leaks',
        slug: 'identifying-concrete-slab-leaks',
        content: '<p>Concrete slab cracking is an engineering challenge. Standard concrete is porous and naturally absorbs water pathways through capillary action. When expansion joints fail, dampness leaks into slab ceilings.</p><p>We recommend diagnostic thermal checks and moisture scans before applying sealants to ensure slab health.</p>',
        coverImage: '/terrace_waterproofing.webp',
        publishedAt: new Date('2026-07-20'),
        isPublished: true,
        author: superadmin._id,
        seoTitle: 'Identify Concrete Slab Leaks | CWF Consulting Corp',
        seoDescription: 'Learn standard concrete leakage checks, expansion joint problems, and diagnostic scans from CWF engineering consultants.',
        tags: ['terrace', 'slab', 'concrete', 'inspection'],
        segment: 'civil',
      },
      {
        title: 'Negative Side Waterproofing Explained',
        slug: 'negative-side-waterproofing-explained',
        content: '<p>Negative-side waterproofing blocks water ingress from the internal face of a retaining wall. This is critical for basements in high-groundwater zones like Hinjawadi and Pune suburbs.</p><p>Using crystalline coatings that react with concrete moisture to block microscopic capillaries is standard engineering practice here.</p>',
        coverImage: '/basement_grouting.webp',
        publishedAt: new Date('2026-07-25'),
        isPublished: true,
        author: superadmin._id,
        seoTitle: 'Negative Side Waterproofing | CWF Consulting Corp',
        seoDescription: 'Understand the engineering science of negative side crystalline slurry and PU injection for basements.',
        tags: ['basement', 'crystalline', 'retaining-wall', 'grouting'],
        segment: 'civil',
      },
      {
        title: 'Modern Scaling Strategies for Enterprise Apps',
        slug: 'scaling-enterprise-apps-nodejs',
        content: '<p>Scalability starts at the architectural level. By offloading resource-heavy computations to background workers and utilizing Redis caches, Node.js APIs can handle thousands of concurrent requests seamlessly.</p>',
        coverImage: '/web_app.webp',
        publishedAt: new Date('2026-08-01'),
        isPublished: true,
        author: superadmin._id,
        seoTitle: 'Scaling Node.js REST APIs | CWF Web',
        seoDescription: 'Learn caching, database connection pooling, and queue strategies for backend software scaling.',
        tags: ['scaling', 'nodejs', 'web-app', 'caching'],
        segment: 'web',
      },
      {
        title: 'Choosing a Modern CMS: Headless vs Traditional',
        slug: 'headless-vs-traditional-cms',
        content: '<p>Selecting a Content Management System directly affects page speeds and editing experiences. Headless CMS engines decouple your content from the presentation layer, delivering JSON data over secure APIs.</p><p>We recommend React frontends paired with Strapi or Sanity for high-growth corporate websites in Pune.</p>',
        coverImage: '/web_corporate.webp',
        publishedAt: new Date('2026-08-05'),
        isPublished: true,
        author: superadmin._id,
        seoTitle: 'Headless CMS vs Traditional CMS | CWF Web',
        seoDescription: 'Analyse the security, speed, and editor experience differences between headless and legacy monolithic CMS setups.',
        tags: ['cms', 'headless', 'nextjs', 'web-dev'],
        segment: 'web',
      },
      {
        title: 'Understanding Working Capital Loans for SMEs',
        slug: 'working-capital-loans-smes',
        content: '<p>SMEs frequently face cash conversion cycle challenges. A structured Working Capital loan or Cash Credit (CC) limit provides liquidity to bridge vendor payment cycles and dynamic payroll gaps.</p><p>Preparing a cash flow analysis statement is the first essential step in assessing credit lines.</p>',
        coverImage: '/finance_advisory.webp',
        publishedAt: new Date('2026-08-10'),
        isPublished: true,
        author: superadmin._id,
        seoTitle: 'SME Working Capital Overdraft CC Limits | CWF Finance',
        seoDescription: 'Learn how to structure working capital limits and manage cash conversion cycles for business liquidity.',
        tags: ['working-capital', 'sme', 'cash-credit', 'debt-advisory'],
        segment: 'finance',
      },
      {
        title: 'Tax Planning Checklist for Indian Businesses in FY 2026',
        slug: 'tax-planning-checklist-fy-2026',
        content: '<p>Effective corporate tax planning requires proactive structuring of business deductions, depreciation allowances, and compliance checks. Preparing documentation before Q4 minimizes year-end adjustment audit liabilities.</p><p>Consulting with certified corporate tax advisors ensures alignment with newer taxation circulars.</p>',
        coverImage: '/finance_advisory.webp',
        publishedAt: new Date('2026-08-15'),
        isPublished: true,
        author: superadmin._id,
        seoTitle: 'Corporate Tax Planning Checklist FY 2026 | CWF Finance',
        seoDescription: 'A practical tax-compliance review guide for SME directors, covering deductions and audit preparedness.',
        tags: ['taxation', 'compliance', 'corporate-tax', 'audit'],
        segment: 'finance',
      },
      {
        title: 'How to Prepare for a Business Loan Application',
        slug: 'prepare-business-loan-application',
        content: '<p>Securing competitive bank funding margins requires presenting a healthy debt service coverage ratio (DSCR). Banks inspect CMA data sheets, credit histories (CIBIL details), and asset valuation reports.</p><p>We guide SME directors through CMA structuring to speed up loan approvals.</p>',
        coverImage: '/finance_advisory.webp',
        publishedAt: new Date('2026-08-20'),
        isPublished: true,
        author: superadmin._id,
        seoTitle: 'Preparing Business Loan Applications & CMA | CWF Finance',
        seoDescription: 'Avoid bank rejection by organizing CMA metrics, credit scores, and collateral valuations.',
        tags: ['business-loan', 'debt-advisory', 'dscr', 'cma-data'],
        segment: 'finance',
      }
    ];
    await BlogPost.insertMany(blogData);
    console.log('Seeded blog articles successfully.');

    // 9. Seed Inquiries
    console.log('Seeding customer inquiry leads...');
    const inquiriesData = [
      {
        name: 'Ganesh Shinde',
        phone: '9822334455',
        email: 'ganesh.shinde@gmail.com',
        propertyType: 'residential',
        serviceInterested: 'terrace',
        message: 'Active rainwater leak in penthouse ceiling. Need terrace scanning.',
        source: 'website-form',
        status: 'new',
        segment: 'civil',
        createdAt: new Date(),
      },
      {
        name: 'Amit Sharma (Web inquiry)',
        phone: '9988776655',
        email: 'amit.sharma@techcorp.com',
        message: 'Looking to build a custom Next.js client portal with role based authentication.',
        source: 'website-form',
        status: 'new',
        segment: 'web',
        segmentDetails: {
          estimatedBudget: 'INR 5-7 Lakhs',
          preferredTimeline: '6 weeks',
        },
        createdAt: new Date(),
      },
      {
        name: 'Ketan Patel (Finance inquiry)',
        phone: '9552332211',
        email: 'k.patel@patelindustries.in',
        message: 'Need corporate debt restructuring consultation for working capital facility.',
        source: 'referral',
        status: 'new',
        segment: 'finance',
        segmentDetails: {
          currentDebtSize: 'INR 5 Crores',
          turnover: 'INR 25 Crores',
        },
        createdAt: new Date(),
      }
    ];
    await Inquiry.insertMany(inquiriesData);
    console.log('Seeded inquiries successfully.');

    console.log('\nSeeding completed successfully! All Mongoose collections fully populated.');
    process.exit(0);
  } catch (error) {
    console.error(`Database seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedAll();
