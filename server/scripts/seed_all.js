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
    ];
    await SegmentInfo.insertMany(segmentsData);
    console.log('Seeded SegmentInfo records successfully.');

    // 4. Seed Services (Civil, Web, and Finance)
    console.log('Seeding service categories...');
    
    // 4a. Civil Services
    const civilServices = [
      {
        title: 'Waterproofing',
        slug: 'waterproofing',
        category: 'waterproofing',
        segment: 'civil',
        shortDescription: 'Comprehensive waterproofing diagnostics and structural sealing systems for complex properties.',
        fullDescription: '<p>We provide full structural moisture audits and design high-durability multi-layer waterproofing specifications for basements, terraces, bathrooms, and water tanks.</p>',
        coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop'],
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
        coverImage: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?q=80&w=600&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?q=80&w=600&auto=format&fit=crop'],
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
        coverImage: 'https://images.unsplash.com/photo-1558904541-efa8c3a30fc9?q=80&w=600&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1558904541-efa8c3a30fc9?q=80&w=600&auto=format&fit=crop'],
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
        coverImage: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=600&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=600&auto=format&fit=crop'],
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
        coverImage: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=600&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=600&auto=format&fit=crop'],
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
        coverImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600&auto=format&fit=crop'],
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
        coverImage: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=600&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=600&auto=format&fit=crop'],
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
        coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop'],
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
        coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop'],
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
        coverImage: 'https://images.unsplash.com/photo-1531834687290-c3b043223e3b?q=80&w=600&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1531834687290-c3b043223e3b?q=80&w=600&auto=format&fit=crop'],
        icon: 'users',
        isPublished: true,
        order: 10,
        warrantyYears: 5,
      }
    ];
    await CivilService.insertMany(civilServices);

    // 4b. Web Services
    const webServices = [
      {
        title: 'Website Development',
        slug: 'website-development-services',
        category: 'website-development',
        segment: 'web',
        shortDescription: 'Modern, responsive corporate websites crafted using React and Tailwind CSS.',
        fullDescription: '<p>We design and develop high-speed marketing websites tailored to your brand identity, optimized for all screen sizes and SEO performance.</p>',
        coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600&auto=format&fit=crop'],
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
        coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop'],
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
        coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600&auto=format&fit=crop'],
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
        coverImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop'],
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
        coverImage: 'https://images.unsplash.com/photo-1561070791-26c113006238?q=80&w=600&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1561070791-26c113006238?q=80&w=600&auto=format&fit=crop'],
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
        coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop'],
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
        coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop'],
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
        coverImage: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=600&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=600&auto=format&fit=crop'],
        icon: 'cloud',
        isPublished: true,
        order: 8,
        techStack: ['AWS', 'Docker', 'Kubernetes', 'GitHub Actions'],
        projectTimeline: '6-12 weeks',
        pricingModel: 'hourly',
      }
    ];
    await WebService.insertMany(webServices);

    // 4c. Finance Services
    const financeServices = [
      {
        title: 'Investment Planning',
        slug: 'investment-planning-solutions',
        category: 'investment-planning',
        segment: 'finance',
        shortDescription: 'Goal-based tax-efficient investment structures and capital allocations.',
        fullDescription: '<p>Structuring customized investment portfolios mapping to target timelines, risk parameters, and liquidity profiles.</p>',
        coverImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=600&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=600&auto=format&fit=crop'],
        icon: 'briefcase',
        isPublished: true,
        order: 1,
        loanRangeMin: null,
        loanRangeMax: null,
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
        coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop'],
        icon: 'shield',
        isPublished: true,
        order: 2,
        loanRangeMin: null,
        loanRangeMax: null,
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
        coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop'],
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
        coverImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=600&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=600&auto=format&fit=crop'],
        icon: 'globe',
        isPublished: true,
        order: 4,
        loanRangeMin: null,
        loanRangeMax: null,
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
        coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop'],
        icon: 'user-check',
        isPublished: true,
        order: 5,
        loanRangeMin: null,
        loanRangeMax: null,
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
        coverImage: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?q=80&w=600&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1533750349088-cd871a92f312?q=80&w=600&auto=format&fit=crop'],
        icon: 'alert-triangle',
        isPublished: true,
        order: 6,
        loanRangeMin: null,
        loanRangeMax: null,
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
        coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop'],
        icon: 'calendar',
        isPublished: true,
        order: 7,
        loanRangeMin: null,
        loanRangeMax: null,
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
        coverImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=600&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=600&auto=format&fit=crop'],
        icon: 'activity',
        isPublished: true,
        order: 8,
        loanRangeMin: null,
        loanRangeMax: null,
        interestRateInfo: 'Fee-based (AUM percentage)',
        eligibilityNotes: 'Minimum investment volume of INR 25 Lakhs suggested.',
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
        coverImage: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?q=80&w=600&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?q=80&w=600&auto=format&fit=crop'],
        isFeatured: true,
        completionDate: new Date('2026-05-15'),
        location: 'Kothrud, Pune',
        clientType: 'residential',
        serviceCategory: 'waterproofing',
        beforeImages: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop'],
        afterImages: ['https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?q=80&w=600&auto=format&fit=crop'],
        sqftTreated: 4200,
      },
      {
        title: 'Basement Retaining Wall Grouting',
        segment: 'civil',
        description: 'Hydrostatic pressure leakage halted using pressure polyurethane injection ports on retaining concrete walls of an IT Park basement.',
        coverImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600&auto=format&fit=crop'],
        isFeatured: true,
        completionDate: new Date('2026-06-30'),
        location: 'Hinjawadi, Pune',
        clientType: 'commercial',
        serviceCategory: 'waterproofing',
        beforeImages: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop'],
        afterImages: ['https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600&auto=format&fit=crop'],
        sqftTreated: 8500,
      },
      {
        title: 'Industrial Tank Epoxy Rehabilitation',
        segment: 'civil',
        description: 'Completed food-grade epoxy lining, concrete patch repairs, and structural joint grouting for a pharmaceutical factory drinking reservoir.',
        coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop'],
        isFeatured: true,
        completionDate: new Date('2026-04-10'),
        location: 'Hadapsar, Pune',
        clientType: 'industrial',
        serviceCategory: 'waterproofing',
        beforeImages: ['https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=600&auto=format&fit=crop'],
        afterImages: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop'],
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
        coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600&auto=format&fit=crop'],
        isFeatured: true,
        completionDate: new Date('2026-05-15'),
        liveUrl: 'https://agri-export-demo.com',
        techStack: ['React', 'Node.js', 'MongoDB', 'TailwindCSS', 'Redux Toolkit'],
      },
      {
        title: 'Pune FinTech SaaS Dashboard',
        segment: 'web',
        description: 'Engineered a secure financial analytics web interface featuring interactive SVG charts, dynamic risk profiling, and complex database transactions.',
        coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop'],
        isFeatured: true,
        completionDate: new Date('2026-06-30'),
        liveUrl: 'https://fintech-saas-demo.com',
        techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
      },
      {
        title: 'High-Performance Next.js Corporate Portal',
        segment: 'web',
        description: 'Developed a fully static, fast corporate presence for a structural engineering firm. Built with optimized assets, next-gen images, and headless CMS integrations.',
        coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop'],
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
        coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop'],
        isFeatured: true,
        completionDate: new Date('2026-05-15'),
        outcomeMetric: 'Saved INR 24 Lakhs annually in interest charges, restructured INR 8 Crores debt',
        clientIndustry: 'Automotive Components Manufacturing',
      },
      {
        title: 'Working Capital Optimisation & Funding Round',
        segment: 'finance',
        description: 'Facilitated cash credit limits and invoice discounting facilities for a major logistics provider during high expansion monsoons.',
        coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop'],
        isFeatured: true,
        completionDate: new Date('2026-06-30'),
        outcomeMetric: 'Secured INR 15 Crores working capital limit, improved cash conversion cycle by 18 days',
        clientIndustry: 'Logistics & Supply Chain Solutions',
      },
      {
        title: 'Corporate Tax Planning & Compliance Overhaul',
        segment: 'finance',
        description: 'Formulated a legally sound cross-state asset holding strategy for a hospital network to optimize depreciation deductions and compliance cycles.',
        coverImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=600&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=600&auto=format&fit=crop'],
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
