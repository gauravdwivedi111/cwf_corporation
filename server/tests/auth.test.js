import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import User from '../src/models/User.js';

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect('mongodb://127.0.0.1:27017/cwf_corporation_test');
    }
    await User.deleteMany({});

    // Seed deterministic test admin
    await User.create({
      email: 'testadmin@cwf.com',
      password: 'Admin@123',
      role: 'superadmin',
      isActive: true,
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/auth/login', () => {
    test('should login with valid credentials and set cookie', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testadmin@cwf.com',
          password: 'Admin@123',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body.user.email).toBe('testadmin@cwf.com');
      expect(res.body.user.role).toBe('superadmin');

      // Check cookie headers
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toMatch(/refreshToken=/);
    });

    test('should reject invalid credentials with 401', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testadmin@cwf.com',
          password: 'WrongPassword123',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Invalid email or password/);
    });

    test('should reject login request with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testadmin@cwf.com',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body).toHaveProperty('errors');
    });
  });

  describe('POST /api/auth/refresh', () => {
    test('should issue a new token with valid refresh token cookie', async () => {
      // First, log in to get a refresh token cookie
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testadmin@cwf.com',
          password: 'Admin@123',
        });

      const refreshTokenCookie = loginRes.headers['set-cookie'][0].split(';')[0];

      const res = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', [refreshTokenCookie]);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('accessToken');
    });

    test('should reject refresh token request when cookie is missing', async () => {
      const res = await request(app)
        .post('/api/auth/refresh')
        .send();

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Refresh token is missing/);
    });

    test('should reject request with an invalid/expired refresh token', async () => {
      const res = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', ['refreshToken=invalidtokenvalue123']);

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Invalid or expired refresh token/);
    });
  });
});
