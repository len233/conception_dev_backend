import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import config from './config/config';
import postgres from './config/postgres';
import mongodb from './config/mongodb';
import routes from './routes';
import { setupSwagger } from './config/swagger';
import { globalRateLimit } from './middleware/security';

dotenv.config();

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.app.use(globalRateLimit);

    this.app.use(cors({
      origin: config.cors.origin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  }

  private initializeRoutes(): void {
    setupSwagger(this.app);
    
    this.app.use('/api', routes);

    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'StockLink Pro API',
        version: '1.0.0',
        documentation: '/docs',
        api: '/api'
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use('*', (req, res) => {
      res.status(404).json({ error: 'Route non trouvée' });
    });
    
    this.app.use((err: any, req: any, res: any, next: any) => {
      res.status(500).json({ error: 'Erreur serveur' });
    });
  }

  public async initializeDatabases(): Promise<void> {
    let postgresConnected = false;
    let mongodbConnected = false;
    let errors = [];

    try {
      await postgres.initializeTables();
      postgresConnected = true;
      console.log('PostgreSQL connecté avec succès');
    } catch (pgError: any) {
      console.warn('PostgreSQL:', pgError.message);
      errors.push(`PostgreSQL: ${pgError.message}`);
    }

    // Test MongoDB séparément
    try {
      await mongodb.connect();
      mongodbConnected = true;
      console.log('MongoDB connecté avec succès');
    } catch (mongoError: any) {
      console.warn('MongoDB:', mongoError.message);
      errors.push(`MongoDB: ${mongoError.message}`);
    }

    if (!postgresConnected && !mongodbConnected) {
      throw new Error(`Aucune base de données connectée: ${errors.join(', ')}`);
    }
  }

  public async listen(): Promise<void> {
    try {
      try {
        await this.initializeDatabases();
        console.log('Bases de données avec succès');
      } catch (dbError: any) {
        console.warn('Serveur démarré avec connexions partielles');
        console.log('Mode développement - API partiellement fonctionnelle');
      }

      this.app.listen(config.port, () => {
        console.log(`Serveur démarré sur le port ${config.port}`);
        console.log(`URL: http://localhost:${config.port}`);
        console.log(`Documentation: http://localhost:${config.port}/docs`);
      });

    } catch (error) {
      console.error('Erreur critique lors du démarrage:', error);
      process.exit(1);
    }
  }


}

export default App;
