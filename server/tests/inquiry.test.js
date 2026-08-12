import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import Inquiry from '../src/models/Inquiry.js';

describe('Inquiry Endpoints and Rate Limiter', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect('mongodb://127.0.0.1:27017/cwf_corporation_test');
    }
    await Inquiry.deleteMany({});
  });

  afterAll(async () => {
    await Inquiry.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/inquiries', () => {
    test('should submit inquiry with valid payload', async () => {
      const payload = {
        name: 'John Doe',
        phone: '9856117811',
        email: 'john.doe@example.com',
        propertyType: 'residential',
        serviceInterested: 'terrace',
        message: 'Active water logging on the terrace ceiling.',
      };

      const res = await request(app)
        .post('/api/inquiries')
        .send(payload);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.name).toBe('John Doe');
    });

    test('should reject inquiry with missing required fields', async () => {
      const payload = {
        phone: '9856117811',
        email: 'john.doe@example.com',
        propertyType: 'residential',
      };

      const res = await request(app)
        .post('/api/inquiries')
        .send(payload);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body).toHaveProperty('errors');
    });

    test('should reject inquiry with invalid phone format', async () => {
      const payload = {
        name: 'John Doe',
        phone: 'invalid-phone-num',
        propertyType: 'residential',
        serviceInterested: 'terrace',
        message: 'Active water logging.',
      };

      const res = await request(app)
        .post('/api/inquiries')
        .send(payload);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors[0].message).toMatch(/valid phone number/);
    });

    test('should trigger 429 Too Many Requests on the 6th consecutive submission', async () => {
      const payload = {
        name: 'Spam Bot',
        phone: '9856117812',
        email: 'spam@bot.com',
        propertyType: 'other',
        serviceInterested: 'other',
        message: 'Inundating the service registry with inquiries.',
      };

      // Since we already made 1 valid request in the first test, we make 5 more.
      // Total requests made from this IP:
      // Request 1: Passed (first test)
      // Request 2-5: Should pass (or hit 429 if rate limiter was already touched)
      // Request 6: Must return 429 Too Many Requests

      let statuses = [];
      for (let i = 0; i < 5; i++) {
        const res = await request(app)
          .post('/api/inquiries')
          .send(payload);
        statuses.push(res.statusCode);
      }

      // Check if 429 was returned on the final request
      const lastStatus = statuses[statuses.length - 1];
      expect(lastStatus).toBe(429);
    });
  });
});
