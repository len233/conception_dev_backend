const request = require('supertest');
const app = require('./server');

describe('Server Express - Tests d\'intégration', () => {
  
  test('POST /average calcule la moyenne correctement', async () => {
    const response = await request(app)
      .post('/average')
      .send({ numbers: [1, 2, 3, 4] })
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(response.body).toEqual({ average: 2.5 });
  });

  test('POST /average fonctionne avec des nombres décimaux', async () => {
    const response = await request(app)
      .post('/average')
      .send({ numbers: [1.5, 2.5, 3.5, 4.5] })
      .expect(200);
    
    expect(response.body).toEqual({ average: 3 });
  });

  test('POST /average fonctionne avec des nombres négatifs', async () => {
    const response = await request(app)
      .post('/average')
      .send({ numbers: [-10, -5, 0, 5, 10] })
      .expect(200);
    
    expect(response.body).toEqual({ average: 0 });
  });

  test('POST /average retourne 400 si numbers n\'est pas un tableau', async () => {
    const response = await request(app)
      .post('/average')
      .send({ numbers: "pas un tableau" })
      .expect(400);
    
    expect(response.body).toEqual({ 
      error: 'Le champ "numbers" doit être un tableau' 
    });
  });

  test('POST /average retourne 400 si le tableau est vide', async () => {
    const response = await request(app)
      .post('/average')
      .send({ numbers: [] })
      .expect(400);
    
    expect(response.body).toEqual({ 
      error: 'Le tableau ne peut pas être vide' 
    });
  });

  test('POST /average retourne 400 si le tableau contient des non-nombres', async () => {
    const response = await request(app)
      .post('/average')
      .send({ numbers: [1, 2, "trois", 4] })
      .expect(400);
    
    expect(response.body).toEqual({ 
      error: 'Tous les éléments du tableau doivent être des nombres' 
    });
  });

  test('POST /average retourne 400 si numbers est manquant', async () => {
    const response = await request(app)
      .post('/average')
      .send({})
      .expect(400);
    
    expect(response.body).toEqual({ 
      error: 'Le champ "numbers" doit être un tableau' 
    });
  });

  test('POST /average fonctionne avec un seul nombre', async () => {
    const response = await request(app)
      .post('/average')
      .send({ numbers: [42] })
      .expect(200);
    
    expect(response.body).toEqual({ average: 42 });
  });

  test('POST /average gère les très petites décimales', async () => {
    const response = await request(app)
      .post('/average')
      .send({ numbers: [0.1, 0.2, 0.3] })
      .expect(200);
    
    // Utilisation de toBeCloseTo pour gérer les erreurs de précision des nombres flottants
    expect(response.body.average).toBeCloseTo(0.2, 10);
  });

});
