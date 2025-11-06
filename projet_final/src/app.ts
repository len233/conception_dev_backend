import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import config from './config/config';
import postgres from './config/postgres';
import mongodb from './config/mongodb';
import routes from './routes';

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
    this.app.use(cors());

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(): void {
    this.app.use('/api', routes);

    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'StockLink Core API',
        version: '1.0.0',
        documentation: '/api',
        health: '/api/health'
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
    try {
      await postgres.initializeTables();
      await mongodb.connect();
    } catch (error) {
      throw error;
    }
  }

  public async listen(): Promise<void> {
    try {
      await this.initializeDatabases();

      this.app.listen(config.port, () => {
      });

      this.setupGracefulShutdown();

    } catch (error) {
      process.exit(1);
    }
  }

  private setupGracefulShutdown(): void {
    const shutdown = async (signal: string) => {
      try {
        await postgres.close();
        await mongodb.close();
        process.exit(0);
      } catch (error) {
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('uncaughtException', (error) => {
      shutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason, promise) => {
      shutdown('unhandledRejection');
    });
  }
}

export default App;
