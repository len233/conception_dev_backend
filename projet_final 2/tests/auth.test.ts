import request from 'supertest';
import App from '../src/app';

describe('Auth Integration Test', () => {
  let app: any;

  beforeAll(() => {
    const appInstance = new App();
    app = appInstance.app;
  });

  describe('POST /api/auth/login', () => {
    test('devrait rejeter des identifiants manquants', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      expect([400, 429]).toContain(response.status);
      expect(response.body.success).toBe(false);
    });

    test('devrait rejeter des identifiants invalides', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'inexistant',
          password: 'motdepasseinvalide'
        });

      expect([401, 429, 500]).toContain(response.status);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/register', () => {
    test('devrait rejeter un utilisateur sans données', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({});

      expect([400, 429]).toContain(response.status);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/products (protection)', () => {
    test('devrait rejeter un accès sans token', async () => {
      const response = await request(app)
        .get('/api/products');

      expect([401, 429, 500]).toContain(response.status);
      expect(response.body.success).toBe(false);
    });
  });
});
