import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'StockLink Pro API',
      version: '1.0.0',
      description: 'API sécurisée pour la gestion d\'entrepôts avec authentification JWT'
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    tags: [
      { name: 'Authentication' },
      { name: 'Products' },
      { name: 'Movements' },
      { name: 'Warehouses' },
      { name: 'Locations' }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], 
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Application): void => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

  app.get('/docs.json', (req: any, res: any) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};

export default specs;
