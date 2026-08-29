import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import User from '../src/models/User.js';
import Service from '../src/models/Service.js';
import Project from '../src/models/Project.js';
import Testimonial from '../src/models/Testimonial.js';
import BlogPost from '../src/models/BlogPost.js';
import TeamMember from '../src/models/TeamMember.js';
import SegmentInfo from '../src/models/SegmentInfo.js';

describe('Segment-Aware API Layer & Discriminator Validation', () => {
  let adminToken;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect('mongodb://127.0.0.1:27017/cwf_corporation_test');
    }
    
    // Clear collections
    await User.deleteMany({});
    await Service.deleteMany({});
    await Project.deleteMany({});
    await Testimonial.deleteMany({});
    await TeamMember.deleteMany({});
    await SegmentInfo.deleteMany({});

    // Seed SegmentInfo records
    await SegmentInfo.create([
      {
        segment: 'civil',
        displayName: 'Civil & Waterproofing',
        tagline: 'PROTECT • REPAIR • TRANSFORM',
        heroDescription: 'Civil description',
        icon: 'Shield',
        order: 1,
      },
      {
        segment: 'web',
        displayName: 'Software & Web',
        tagline: 'CONNECT • DIGITALIZE • GROW',
        heroDescription: 'Web description',
        icon: 'Code',
        order: 2,
      },
      {
        segment: 'finance',
        displayName: 'Financial Advisory',
        tagline: 'Strategic Corporate Debt Advisory',
        heroDescription: 'Finance description',
        icon: 'TrendingUp',
        order: 3,
      },
    ]);

    // Seed test admin
    await User.create({
      email: 'testadmin@cwf.com',
      password: 'Admin@123',
      role: 'superadmin',
      isActive: true,
    });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testadmin@cwf.com', password: 'Admin@123' });
    adminToken = loginRes.body.accessToken;

    // Seed dummy services for different segments
    await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Terrace Sealing',
        slug: 'terrace-sealing',
        segment: 'civil',
        category: 'terrace',
        shortDescription: 'Terrace sealant.',
        fullDescription: 'Long terrace sealant description.',
        coverImage: '/img.png',
        icon: 'droplet',
        isPublished: true,
        warrantyYears: 5,
      });

    await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'E-commerce Shop Development',
        slug: 'ecommerce-shop-development',
        segment: 'web',
        category: 'e-commerce',
        shortDescription: 'Online shop.',
        fullDescription: 'Next.js stripe integration details.',
        coverImage: '/img2.png',
        icon: 'code',
        isPublished: true,
        techStack: ['Next.js', 'Stripe'],
        pricingModel: 'fixed',
      });

    await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'SME Loan Advisory',
        slug: 'sme-loan-advisory',
        segment: 'finance',
        category: 'business-loan',
        shortDescription: 'Securing SME loans.',
        fullDescription: 'SME loan advisory details.',
        coverImage: '/img3.png',
        icon: 'trending-up',
        isPublished: true,
        loanRangeMin: 100000,
        loanRangeMax: 500000,
      });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Service.deleteMany({});
    await Project.deleteMany({});
    await Testimonial.deleteMany({});
    await TeamMember.deleteMany({});
    await SegmentInfo.deleteMany({});
    await mongoose.connection.close();
  });

  describe('1. Public SegmentInfo Routes', () => {
    test('GET /api/segments should return all 3 segments', async () => {
      const res = await request(app).get('/api/segments');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(3);
      expect(res.body.data[0].segment).toBe('civil');
      expect(res.body.data[1].segment).toBe('web');
      expect(res.body.data[2].segment).toBe('finance');
    });

    test('GET /api/segments/:segment should return single segment landing content', async () => {
      const res = await request(app).get('/api/segments/web');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.segment).toBe('web');
      expect(res.body.data.displayName).toBe('Software & Web');
    });

    test('GET /api/segments/invalid should return 404', async () => {
      const res = await request(app).get('/api/segments/invalid');
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('2. Public Segment-Filtered Resource Retrieval', () => {
    test('GET /api/services?segment=web should return only web services', async () => {
      const res = await request(app).get('/api/services?segment=web');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].segment).toBe('web');
      expect(res.body.data[0].slug).toBe('ecommerce-shop-development');
    });

    test('GET /api/services?segment=finance should return only finance services', async () => {
      const res = await request(app).get('/api/services?segment=finance');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].segment).toBe('finance');
      expect(res.body.data[0].slug).toBe('sme-loan-advisory');
    });
  });

  describe('3. Dynamic Category Validation (Symmetric in Both Directions)', () => {
    test('Submitting a Web service with a Civil category should be rejected', async () => {
      const res = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Invalid Web Service',
          slug: 'invalid-web-service-1',
          segment: 'web',
          category: 'terrace', // terrace is civil only
          shortDescription: 'Invalid.',
          fullDescription: 'Invalid.',
          coverImage: '/img.png',
          icon: 'code',
          pricingModel: 'fixed',
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors[0].message).toContain('Category must be one of');
    });

    test('Submitting a Web service with a Finance category should be rejected', async () => {
      const res = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Invalid Web Service',
          slug: 'invalid-web-service-2',
          segment: 'web',
          category: 'business-loan', // business-loan is finance only
          shortDescription: 'Invalid.',
          fullDescription: 'Invalid.',
          coverImage: '/img.png',
          icon: 'code',
          pricingModel: 'fixed',
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors[0].message).toContain('Category must be one of');
    });

    test('Submitting a Finance service with a Web category should be rejected', async () => {
      const res = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Invalid Finance Service',
          slug: 'invalid-finance-service-1',
          segment: 'finance',
          category: 'e-commerce', // e-commerce is web only
          shortDescription: 'Invalid.',
          fullDescription: 'Invalid.',
          coverImage: '/img.png',
          icon: 'trending-up',
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors[0].message).toContain('Category must be one of');
    });
  });

  describe('4. Mixed Segment Payload Gating (validateSegmentPayload Proof)', () => {
    test('Submitting loanRangeMin on a Civil service creation should be rejected', async () => {
      const res = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Hybrid Service Request',
          slug: 'hybrid-service-request-1',
          segment: 'civil',
          category: 'terrace',
          shortDescription: 'Short.',
          fullDescription: 'Long.',
          coverImage: '/img.png',
          icon: 'droplet',
          loanRangeMin: 10000, // Finance field mixed in!
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("Field 'loanRangeMin' is not allowed for segment 'civil'");
    });

    test('Submitting warrantyYears on a Web service creation should be rejected', async () => {
      const res = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Hybrid Service Request',
          slug: 'hybrid-service-request-2',
          segment: 'web',
          category: 'e-commerce',
          shortDescription: 'Short.',
          fullDescription: 'Long.',
          coverImage: '/img.png',
          icon: 'code',
          pricingModel: 'fixed',
          warrantyYears: 5, // Civil field mixed in!
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("Field 'warrantyYears' is not allowed for segment 'web'");
    });
  });
});
