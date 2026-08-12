import mongoose from 'mongoose';
import dotenv from 'dotenv';
import crypto from 'crypto';
import User from '../src/models/User.js';
import SiteSettings from '../src/models/SiteSettings.js';
import Service from '../src/models/Service.js';
import Project from '../src/models/Project.js';
import BlogPost from '../src/models/BlogPost.js';
import Testimonial from '../src/models/Testimonial.js';
import TeamMember from '../src/models/TeamMember.js';
import Inquiry from '../src/models/Inquiry.js';
import dns from 'dns';

// Force DNS servers to Google DNS to bypass local router/Windows SRV resolution limitations
dns.setServers(['8.8.8.8', '8.8.4.4']);

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
      aboutText: 'CWF Corporation Pune provides state of the art waterproofing consultation, structural diagnostics, and engineering audits.',
      certifications: [
        'ISO 9001:2015 Structural Safety Certified',
        'NACE Level 2 Coating Quality Audited',
        'Member of Waterproofing Association of India'
      ],
    });
    console.log('SiteSettings seeded successfully.');

    // 3. Seed Waterproofing Services (All 6 core categories)
    console.log('Seeding service categories...');
    const servicesData = [
      {
        title: 'Terrace Waterproofing',
        slug: 'terrace-waterproofing',
        category: 'terrace',
        shortDescription: 'Forensic audits and multi-layer polyurethane coatings to seal slab fractures and joint entries.',
        fullDescription: '<p>Terraces in Pune face intense temperature changes and heavy monsoon rainfall, causing micro-fractures in concrete slabs. Our inspection starts with moisture meters and thermal imaging to locate water ingress pathways.</p><p>We specify double-layer polyurethane lining coupled with polymer modified mortar joint repairs to provide long-term structural safety.</p>',
        coverImage: '/terrace_waterproofing.webp',
        gallery: [
          '/terrace_waterproofing.webp'
        ],
        icon: 'droplet',
        isPublished: true,
        order: 1,
      },
      {
        title: 'Basement Waterproofing & Grouting',
        slug: 'basement-waterproofing',
        category: 'basement',
        shortDescription: 'Pressure injection grouting and negative-side crystalline lining to block hydrostatic groundwater pressure.',
        fullDescription: '<p>High water tables in Pune during the monsoon put immense hydrostatic pressure on retaining walls. We perform non-destructive concrete scanning and core drills to evaluate moisture paths.</p><p>We inject low-viscosity polyurethane expanding grouts into fissures and apply specialized crystalline slurry coatings on retaining wall faces.</p>',
        coverImage: '/basement_grouting.webp',
        gallery: [
          '/basement_grouting.webp'
        ],
        icon: 'shield',
        isPublished: true,
        order: 2,
      },
      {
        title: 'Bathroom Wet Area Sealing',
        slug: 'bathroom-waterproofing',
        category: 'bathroom',
        shortDescription: 'Leak diagnostics for drain traps, tile joints, and pipes, followed by high-grade under-tile membranes.',
        fullDescription: '<p>Failure of bathroom waterproofing causes damp patches on ceiling slabs below. We perform dye-testing and drain-line visual scoping to identify leakage sources.</p><p>Our solutions include laying heavy-duty elastomeric acrylic membranes and re-filling joint tiles with chemical-resistant epoxy sealants.</p>',
        coverImage: '/bathroom_sealing.webp',
        gallery: [
          '/bathroom_sealing.webp'
        ],
        icon: 'bath',
        isPublished: true,
        order: 3,
      },
      {
        title: 'Clean Water Tank Lining',
        slug: 'water-tank-sealing',
        category: 'tank',
        shortDescription: 'Food-grade, non-toxic epoxy linings and internal sanitization for concrete drinking water reservoirs.',
        fullDescription: '<p>Cracked water tanks lose thousands of liters daily and suffer from reinforcement corrosion. We scrape and sanitize internal walls, apply food-grade, non-toxic epoxy linings, and reinforce structural joints with non-shrink grout.</p>',
        coverImage: '/water_tank.webp',
        gallery: [
          '/water_tank.webp'
        ],
        icon: 'database',
        isPublished: true,
        order: 4,
      },
      {
        title: 'Exterior Wall Facade Protection',
        slug: 'facade-sealing',
        category: 'facade',
        shortDescription: 'Hydrophobic silane-siloxane exterior wall sprays and elastomeric paint coatings to seal rain micro-cracks.',
        fullDescription: '<p>Wind-driven monsoons force rainwater through plaster micro-cracks, causing internal dampness. We apply breathable, hydrophobic silane-siloxane sprays and flexible elastomeric coatings that span active hairline fractures.</p>',
        coverImage: '/exterior_facade.webp',
        gallery: [
          '/exterior_facade.webp'
        ],
        icon: 'home',
        isPublished: true,
        order: 5,
      },
      {
        title: 'PU Injection Crack Grouting',
        slug: 'injection-grouting',
        category: 'injection-grouting',
        shortDescription: 'Pressure injection of reactive polyurethane resins into structural cracks to form instant water-tight foam seals.',
        fullDescription: '<p>For active leaks in concrete slabs or joints, we drill and install packers to inject low-viscosity PU resins. These react with moisture, expanding up to 20 times their volume to form a resilient, flexible water-tight foam seal inside the concrete structure.</p>',
        coverImage: '/injection_grouting.webp',
        gallery: [
          '/injection_grouting.webp'
        ],
        icon: 'wrench',
        isPublished: true,
        order: 6,
      }
    ];

    const seededServices = await Service.insertMany(servicesData);
    console.log(`Seeded ${seededServices.length} services successfully.`);

    // 4. Seed Projects (6 case studies)
    console.log('Seeding portfolio case studies...');
    const projectsData = [
      {
        title: 'Terrace Slab Waterproofing & Leakage Repair',
        slug: 'terrace-waterproofing-kothrud',
        description: 'Forensic slab audit and polyurethane membrane treatment for a residential complex in Kothrud, Pune. Resolved active rainwater ceiling leakage.',
        location: 'Kothrud, Pune',
        clientType: 'residential',
        serviceCategory: 'terrace',
        beforeImages: ['/terrace_before.webp'],
        afterImages: ['/terrace_waterproofing.webp'],
        sqftTreated: 4200,
        completionDate: new Date('2026-05-15'),
        isFeatured: true,
      },
      {
        title: 'Basement Retaining Wall Grouting',
        slug: 'basement-grouting-hinjawadi',
        description: 'Hydrostatic pressure leakage halted using pressure polyurethane injection ports on retaining concrete walls of an IT Park basement.',
        location: 'Hinjawadi, Pune',
        clientType: 'commercial',
        serviceCategory: 'basement',
        beforeImages: ['/terrace_before.webp'],
        afterImages: ['/basement_grouting.webp'],
        sqftTreated: 8500,
        completionDate: new Date('2026-06-30'),
        isFeatured: true,
      },
      {
        title: 'Industrial Tank Epoxy Rehabilitation',
        slug: 'industrial-tank-hadapsar',
        description: 'Completed food-grade epoxy lining, concrete patch repairs, and structural joint grouting for a pharmaceutical factory drinking reservoir.',
        location: 'Hadapsar, Pune',
        clientType: 'industrial',
        serviceCategory: 'tank',
        beforeImages: ['/terrace_before.webp'],
        afterImages: ['/water_tank.webp'],
        sqftTreated: 3200,
        completionDate: new Date('2026-04-10'),
        isFeatured: true,
      },
      {
        title: 'Facade Plaster Cracks Hydrophobic Coating',
        slug: 'facade-sealing-kalyani-nagar',
        description: 'Tackled high-rise moisture ingress by applying hydrophobic silane sprays and elastomeric paint to exterior wall faces.',
        location: 'Kalyani Nagar, Pune',
        clientType: 'commercial',
        serviceCategory: 'facade',
        beforeImages: ['/terrace_before.webp'],
        afterImages: ['/exterior_facade.webp'],
        sqftTreated: 15400,
        completionDate: new Date('2026-07-18'),
        isFeatured: false,
      },
      {
        title: 'Residential Bathroom Under-Tile Grouting',
        slug: 'bathroom-sealing-baner',
        description: 'Repaired under-tile bathroom leaks without floor demolition using polymer grout injection and epoxy tile joint sealing.',
        location: 'Baner, Pune',
        clientType: 'residential',
        serviceCategory: 'bathroom',
        beforeImages: ['/terrace_before.webp'],
        afterImages: ['/bathroom_sealing.webp'],
        sqftTreated: 350,
        completionDate: new Date('2026-03-22'),
        isFeatured: false,
      },
      {
        title: 'Basement Joint PU Grout Injection',
        slug: 'basement-grouting-chinchwad',
        description: 'Halted active water ingress through expansion joints in a commercial mall parking deck using high-pressure PU expanding foam.',
        location: 'Chinchwad, Pune',
        clientType: 'commercial',
        serviceCategory: 'injection-grouting',
        beforeImages: ['/terrace_before.webp'],
        afterImages: ['/injection_grouting.webp'],
        sqftTreated: 1200,
        completionDate: new Date('2026-07-28'),
        isFeatured: true,
      }
    ];

    const seededProjects = await Project.insertMany(projectsData);
    console.log(`Seeded ${seededProjects.length} portfolio projects successfully.`);

    // 5. Seed Testimonials (5 clients)
    console.log('Seeding client reviews...');
    const testimonialsData = [
      {
        clientName: 'Rajesh Patil',
        clientType: 'residential',
        rating: 5,
        text: 'The diagnostic audit was extremely detailed. CWF engineers found leakage paths standard contractors missed. Their polyurethane prescription completely solved our terrace issue.',
        photo: 'https://res.cloudinary.com/demo/image/upload/w_100,h_100/sample.jpg',
        isPublished: true,
      },
      {
        clientName: 'Amit Shah',
        clientType: 'commercial',
        rating: 5,
        text: 'Outstanding technical supervision. Their site engineer verified every coat layer thickness and material mix. Highly recommend for commercial waterproofing.',
        photo: 'https://res.cloudinary.com/demo/image/upload/w_100,h_100/sample.jpg',
        isPublished: true,
      },
      {
        clientName: 'Dr. Shruti Nair',
        clientType: 'residential',
        rating: 5,
        text: 'Excellent bathroom leak repair! The injection grouting methodology saved us from noisy, dusty floor demolition. Professional service throughout.',
        photo: 'https://res.cloudinary.com/demo/image/upload/w_100,h_100/sample.jpg',
        isPublished: true,
      },
      {
        clientName: 'Vikas Deshmukh',
        clientType: 'industrial',
        rating: 4,
        text: 'Very satisfied with the tank epoxy lining. The inspection team carried out thorough testing before certification. Highly recommended.',
        photo: 'https://res.cloudinary.com/demo/image/upload/w_100,h_100/sample.jpg',
        isPublished: true,
      },
      {
        clientName: 'Karan Malhotra',
        clientType: 'commercial',
        rating: 5,
        text: 'Halting the basement groundwater ingress in our mall car park seemed impossible, but their PU injection packers solved it within 3 days.',
        photo: 'https://res.cloudinary.com/demo/image/upload/w_100,h_100/sample.jpg',
        isPublished: true,
      }
    ];

    const seededTestimonials = await Testimonial.insertMany(testimonialsData);
    console.log(`Seeded ${seededTestimonials.length} testimonials successfully.`);

    // 6. Seed Team Members (4 staff profiles)
    console.log('Seeding team engineer profiles...');
    const teamData = [
      {
        name: 'Vikram Shinde',
        designation: 'Senior Structural Auditor',
        photo: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_fill/sample.jpg',
        bio: 'Civil Engineer with 12 years expertise conducting concrete scans, structural diagnostics, and slab integrity tests across Maharashtra.',
        order: 1,
      },
      {
        name: 'Priya Joshi',
        designation: 'Diagnostics Engineer',
        photo: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_fill/sample.jpg',
        bio: 'Specialist in non-destructive thermal mapping, ultrasonic concrete testing, and moisture index inspections.',
        order: 2,
      },
      {
        name: 'Milind Kulkarni',
        designation: 'Coating Superintendent',
        photo: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_fill/sample.jpg',
        bio: 'NACE Level 2 Coating Quality Inspector with 10 years experience overseeing chemical layer application compliance.',
        order: 3,
      },
      {
        name: 'Rahul More',
        designation: 'Project Site Supervisor',
        photo: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_fill/sample.jpg',
        bio: 'Site logistics specialist ensuring surface preparation, safety compliance, and timeline milestones are hit.',
        order: 4,
      }
    ];

    const seededTeam = await TeamMember.insertMany(teamData);
    console.log(`Seeded ${seededTeam.length} team engineering profiles successfully.`);

    // 7. Seed Blog Posts (4 engineering articles)
    console.log('Seeding editorial blog articles...');
    const blogData = [
      {
        title: 'Identifying Concrete Slab Leaks',
        slug: 'identifying-concrete-slab-leaks',
        content: '<p>Concrete slab cracking is an engineering challenge. Standard concrete is porous and naturally absorbs water pathways through capillary action. When expansion joints fail, dampness leaks into slab ceilings.</p><p>We recommend diagnostic thermal checks and moisture scans before applying sealants to ensure slab health.</p>',
        coverImage: '/terrace_waterproofing.webp',
        publishedAt: new Date('2026-07-20'),
        isPublished: true,
        author: superadmin._id,
        seoTitle: 'How to Identify Concrete Slab Leaks | CWF Corporation',
        seoDescription: 'Learn standard concrete leakage checks, expansion joint problems, and diagnostic scans from CWF engineering consultants.',
        tags: ['terrace', 'slab', 'concrete', 'inspection'],
      },
      {
        title: 'Negative Side Waterproofing Explained',
        slug: 'negative-side-waterproofing-explained',
        content: '<p>Negative-side waterproofing blocks water ingress from the internal face of a retaining wall. This is critical for basements in high-groundwater zones like Hinjawadi and Pune suburbs.</p><p>Using crystalline coatings that react with concrete moisture to block microscopic capillaries is standard engineering practice here.</p>',
        coverImage: '/basement_grouting.webp',
        publishedAt: new Date('2026-07-25'),
        isPublished: true,
        author: superadmin._id,
        seoTitle: 'Negative Side Basement Waterproofing | CWF Corporation',
        seoDescription: 'Understand the engineering science of negative side crystalline slurry and PU injection for basements.',
        tags: ['basement', 'crystalline', 'retaining-wall', 'grouting'],
      },
      {
        title: 'Choosing Between PU and Acrylic Coatings',
        slug: 'polyurethane-vs-acrylic-coatings',
        content: '<p>Polyurethane (PU) membranes offer high elasticity and thermal resistance, making them ideal for exposed rooftops. Acrylic coatings are easier to apply but suited for wet areas under tiles.</p><p>Our structural audits inspect temperature dynamics before specifying chemical coatings.</p>',
        coverImage: '/injection_grouting.webp',
        publishedAt: new Date('2026-08-01'),
        isPublished: true,
        author: superadmin._id,
        seoTitle: 'PU vs Acrylic Waterproofing Membranes | CWF Pune',
        seoDescription: 'Read the differences in membrane elongation, tensile strength, and UV stability for engineering applications.',
        tags: ['polyurethane', 'coatings', 'acrylic', 'materials'],
      },
      {
        title: 'Forensic Concrete Moisture Scans',
        slug: 'forensic-concrete-moisture-scans',
        content: '<p>Waterproofing failure is usually a diagnosis failure. We use non-destructive impedance meters and thermal imaging to map subsurface moisture profiles before prescribing any repairs.</p><p>This scientific approach avoids costly trial-and-error sealing.</p>',
        coverImage: '/bathroom_sealing.webp',
        publishedAt: new Date('2026-08-03'),
        isPublished: false, // Seed as a draft blog post
        author: superadmin._id,
        seoTitle: 'Forensic Concrete Moisture Inspections | CWF',
        seoDescription: 'How engineers use thermal mapping and concrete scanning tools to locate water paths.',
        tags: ['inspection', 'forensics', 'thermal-imaging'],
      }
    ];

    const seededBlogs = await BlogPost.insertMany(blogData);
    console.log(`Seeded ${seededBlogs.length} engineering blog articles successfully.`);

    // 8. Seed Inquiries (12 leads simulating an active business pipeline)
    console.log('Seeding customer inquiry leads...');
    
    // Calculate dates relative to today
    const dateAgo = (days) => {
      const date = new Date();
      date.setDate(date.getDate() - days);
      return date;
    };

    const inquiriesData = [
      {
        name: 'Ganesh Shinde',
        phone: '9822334455',
        email: 'ganesh.shinde@gmail.com',
        propertyType: 'residential',
        serviceInterested: 'terrace',
        message: 'Active rainwater leak in Kothrud penthouse bedroom ceiling. Need a diagnostic scan.',
        source: 'website-form',
        status: 'new',
        assignedTo: null,
        createdAt: dateAgo(1),
        internalNotes: [],
      },
      {
        name: 'Anjali Deshpande',
        phone: '9881234567',
        email: 'anjali.d@deshpandeholdings.com',
        propertyType: 'commercial',
        serviceInterested: 'basement',
        message: 'Basement slab water ingress in Hinjawadi IT office structure. Hydrostatic pressure leakage from joints.',
        source: 'phone',
        status: 'contacted',
        assignedTo: editor1._id,
        createdAt: dateAgo(3),
        internalNotes: [
          {
            note: 'Spoke to owner. Client reports leakage gets worse after heavy rains. Scheduled call back to plan inspection.',
            addedBy: editor1._id,
            createdAt: dateAgo(2),
          }
        ],
      },
      {
        name: 'Rahul Mehta',
        phone: '9552112233',
        email: 'rahul.mehta@residential.org',
        propertyType: 'residential',
        serviceInterested: 'bathroom',
        message: 'Master bathroom shower floor leaking down to the apartment ceiling below. Requesting non-destructive sealing options.',
        source: 'website-form',
        status: 'site-visit-scheduled',
        assignedTo: editor1._id,
        createdAt: dateAgo(5),
        internalNotes: [
          {
            note: 'Initial call completed. Scheduled site survey for concrete scanning on Tuesday morning.',
            addedBy: editor1._id,
            createdAt: dateAgo(4),
          }
        ],
      },
      {
        name: 'Hadapsar Breweries Ltd',
        phone: '0202685942',
        email: 'facilities@hadapsarbreweries.in',
        propertyType: 'industrial',
        serviceInterested: 'tank',
        message: 'Concrete process water reservoir showing cracks. Need inspection for food-grade epoxy lining.',
        source: 'referral',
        status: 'quoted',
        assignedTo: editor2._id,
        createdAt: dateAgo(10),
        internalNotes: [
          {
            note: 'Conducted concrete scanning and core drills. Emailed formal quotation for food-grade epoxy rehabilitation.',
            addedBy: editor2._id,
            createdAt: dateAgo(8),
          }
        ],
      },
      {
        name: 'Sunil Gavaskar',
        phone: '9921123456',
        email: 'sunilg@sportsindia.co.in',
        propertyType: 'residential',
        serviceInterested: 'terrace',
        message: 'Rooftop slab leak. Need high elongation polyurethane membrane waterproofing.',
        source: 'website-form',
        status: 'converted',
        assignedTo: editor1._id,
        createdAt: dateAgo(15),
        internalNotes: [
          {
            note: 'Audit report submitted. Proposal approved. Site engineering crew mobilised.',
            addedBy: editor1._id,
            createdAt: dateAgo(12),
          },
          {
            note: 'Work commenced. Surface preparation and base repairs completed.',
            addedBy: editor1._id,
            createdAt: dateAgo(11),
          }
        ],
      },
      {
        name: 'Rajesh Khanna',
        phone: '9860123456',
        email: 'rkhanna@gmail.com',
        propertyType: 'residential',
        serviceInterested: 'facade',
        message: 'Dampness on East-facing bedroom wall. Heavy monsoon rain ingress from high-rise exterior facade.',
        source: 'website-form',
        status: 'closed',
        assignedTo: editor2._id,
        createdAt: dateAgo(30),
        internalNotes: [
          {
            note: 'Silane-siloxane spray applied to external brickwork. 3-year warranty certificate signed off and handed over.',
            addedBy: editor2._id,
            createdAt: dateAgo(27),
          }
        ],
      },
      {
        name: 'Manoj Bajpayee',
        phone: '9840112233',
        email: 'manoj.bajpayee@hotmail.com',
        propertyType: 'residential',
        serviceInterested: 'injection-grouting',
        message: 'Water leakage from concrete cold joints in home basement cellar. Requesting PU pressure grouting.',
        source: 'website-form',
        status: 'new',
        assignedTo: null,
        createdAt: dateAgo(1),
        internalNotes: [],
      },
      {
        name: 'Neeta Lulla',
        phone: '9766001122',
        email: 'neeta.l@lulladesigns.com',
        propertyType: 'commercial',
        serviceInterested: 'facade',
        message: 'High-rise studio wall damp patch. Rainwater seeping through micro-cracks in exterior texture plaster.',
        source: 'website-form',
        status: 'contacted',
        assignedTo: editor1._id,
        createdAt: dateAgo(2),
        internalNotes: [
          {
            note: 'Left voicemail. Sending WhatsApp follow up details.',
            addedBy: editor1._id,
            createdAt: dateAgo(1),
          }
        ],
      },
      {
        name: 'Sanjay Dutt',
        phone: '9822005544',
        email: 'sanjay.dutt@duttprod.com',
        propertyType: 'residential',
        serviceInterested: 'bathroom',
        message: 'Epoxy tile grout leaking. Ceiling in floor below is damp.',
        source: 'phone',
        status: 'site-visit-scheduled',
        assignedTo: editor2._id,
        createdAt: dateAgo(6),
        internalNotes: [
          {
            note: 'Site survey scheduled for Friday afternoon. Assigned inspector Priya Joshi.',
            addedBy: editor2._id,
            createdAt: dateAgo(5),
          }
        ],
      },
      {
        name: 'Hadapsar Auto Components',
        phone: '02026851122',
        email: 'facilities@hadapsarauto.co.in',
        propertyType: 'industrial',
        serviceInterested: 'injection-grouting',
        message: 'Heavy active water ingress from floor slab expansion joint in our CNC machinery deck.',
        source: 'other',
        status: 'quoted',
        assignedTo: editor2._id,
        createdAt: dateAgo(12),
        internalNotes: [
          {
            note: 'Submitted quote for packing and PU grout injection.',
            addedBy: editor2._id,
            createdAt: dateAgo(10),
          }
        ],
      },
      {
        name: 'Poonam Dhillon',
        phone: '9881112233',
        email: 'poonam@dhillonresidency.com',
        propertyType: 'residential',
        serviceInterested: 'tank',
        message: 'Domestic underground water tank needs waterproofing and structural concrete patch repairs.',
        source: 'website-form',
        status: 'converted',
        assignedTo: editor1._id,
        createdAt: dateAgo(20),
        internalNotes: [
          {
            note: 'Tank cleaned, repaired with polymer modified mortar, and finished with food-grade epoxy. Verified watertight.',
            addedBy: editor1._id,
            createdAt: dateAgo(18),
          }
        ],
      },
      {
        name: 'Aishwarya Rai',
        phone: '9890123456',
        email: 'aishwarya@arholding.com',
        propertyType: 'residential',
        serviceInterested: 'other',
        message: 'Retaining wall leakage in garden area.',
        source: 'website-form',
        status: 'closed',
        assignedTo: editor2._id,
        createdAt: dateAgo(45),
        internalNotes: [
          {
            note: 'Declined proposal. Client decided to go with local mason for simple cement plastering.',
            addedBy: editor2._id,
            createdAt: dateAgo(40),
          }
        ],
      }
    ];

    const seededInquiries = await Inquiry.insertMany(inquiriesData);
    console.log(`Seeded ${seededInquiries.length} customer inquiry leads successfully.`);

    console.log('\nSeeding completed successfully! All Mongoose collections fully populated.');
    process.exit(0);
  } catch (error) {
    console.error(`Database seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedAll();
