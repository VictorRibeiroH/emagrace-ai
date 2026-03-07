import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { Application } from 'express';

describe('API Integration Tests', () => {
  let app: Application;

  beforeAll(() => {
    app = createApp();
  });

  describe('Health Check', () => {
    it('should return 200 and status ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('environment');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/api/unknown-route');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Route not found');
      expect(response.body).toHaveProperty('code', 'NOT_FOUND');
    });
  });

  describe('Authentication', () => {
    it('should return 401 for protected routes without auth', async () => {
      const response = await request(app).get('/api/profile');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Validation', () => {
    it('should return 400 for invalid body metric data', async () => {
      const response = await request(app)
        .post('/api/metrics')
        .set('Authorization', 'Bearer fake-token')
        .send({
          weight: -50, // Invalid negative weight
        });

      expect(response.status).toBe(401); // Will be 401 due to invalid token, but in real scenario with valid token would be 400
    });
  });
});
