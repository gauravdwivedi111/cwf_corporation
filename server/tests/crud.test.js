import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import User from '../src/models/User.js';
import Service from '../src/models/Service.js';

describe('Admin CRUD Operations & Role Enforcement', () => {
  let superadminToken;
  let editorToken;
  let createdServiceId;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect('mongodb://127.0.0.1:27017/cwf_corporation_test');
    }
    await User.deleteMany({});
    await Service.deleteMany({});

    // Seed test accounts
    await User.create({
      email: 'testadmin@cwf.com',
      password: 'Admin@123',
      role: 'superadmin',
      isActive: true,
    });

    await User.create({
      email: 'testeditor@cwf.com',
      password: 'EditorPassword123!',
      role: 'editor',
      isActive: true,
    });

    // Obtain access tokens via login
    const superadminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testadmin@cwf.com', password: 'Admin@123' });
    superadminToken = superadminLogin.body.accessToken;

    const editorLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testeditor@cwf.com', password: 'EditorPassword123!' });
    editorToken = editorLogin.body.accessToken;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Service.deleteMany({});
    await mongoose.connection.close();
  });

  describe('Superadmin Service CRUD cycle', () => {
    test('should CREATE a service successfully', async () => {
      const payload = {
        title: 'Terrace Slab Waterproofing',
        slug: 'terrace-slab-waterproofing',
        category: 'terrace',
        shortDescription: 'Residential complex terrace treatment in Pune.',
        fullDescription: 'Comprehensive forensic moisture scanning followed by multi-layer PU membranes.',
        coverImage: '/terrace_waterproofing.png',
        icon: 'droplet',
        order: 1,
        isPublished: true,
      };

      const res = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${superadminToken}`)
        .send(payload);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      createdServiceId = res.body.data._id;
    });

    test('should READ/GET services successfully', async () => {
      const res = await request(app)
        .get('/api/services');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    test('should UPDATE a service successfully', async () => {
      const payload = {
        title: 'Terrace Slab Waterproofing Updated',
        slug: 'terrace-slab-waterproofing-updated',
        category: 'terrace',
        shortDescription: 'Updated residential complex terrace treatment in Pune.',
        fullDescription: 'Updated description for PU membranes.',
        coverImage: '/terrace_waterproofing.png',
        icon: 'droplet',
        order: 2,
        isPublished: true,
      };

      const res = await request(app)
        .put(`/api/services/${createdServiceId}`)
        .set('Authorization', `Bearer ${superadminToken}`)
        .send(payload);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Terrace Slab Waterproofing Updated');
    });

    test('should DELETE a service successfully', async () => {
      const res = await request(app)
        .delete(`/api/services/${createdServiceId}`)
        .set('Authorization', `Bearer ${superadminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/deleted/);
    });
  });

  describe('Unauthenticated Restrictions', () => {
    test('should return 401 Unauthorized when hitting protected routes without token', async () => {
      const res = await request(app)
        .post('/api/services')
        .send({});

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Authorization token is missing/);
    });
  });

  describe('Role-Based Access Control (RBAC)', () => {
    test('should return 403 Forbidden when editor attempts to hit superadmin-only user creation endpoint', async () => {
      const res = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${editorToken}`)
        .send({
          email: 'newstaff@cwf.com',
          password: 'StaffPassword123!',
          role: 'editor',
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Forbidden/);
    });

    test('should allow editor to successfully perform Services CRUD', async () => {
      const payload = {
        title: 'Editor Grouting Service',
        slug: 'editor-grouting-service',
        category: 'injection-grouting',
        shortDescription: 'Editor created grouting service.',
        fullDescription: 'Full description of editor created grouting service.',
        coverImage: '/injection_grouting.png',
        icon: 'shield',
        order: 5,
        isPublished: true,
      };

      // Create
      const createRes = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${editorToken}`)
        .send(payload);

      expect(createRes.statusCode).toBe(201);
      expect(createRes.body.success).toBe(true);
      const serviceId = createRes.body.data._id;

      // Update
      const updateRes = await request(app)
        .put(`/api/services/${serviceId}`)
        .set('Authorization', `Bearer ${editorToken}`)
        .send({
          ...payload,
          title: 'Editor Grouting Service Updated',
        });

      expect(updateRes.statusCode).toBe(200);
      expect(updateRes.body.success).toBe(true);

      // Delete
      const deleteRes = await request(app)
        .delete(`/api/services/${serviceId}`)
        .set('Authorization', `Bearer ${editorToken}`);

      expect(deleteRes.statusCode).toBe(200);
      expect(deleteRes.body.success).toBe(true);
    });
  });
});
