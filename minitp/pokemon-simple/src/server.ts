import express from 'express';
import dotenv from 'dotenv';
import pokemonRoutes from './routes/pokemonRoutes';
import battleRoutes from './routes/battleRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// Middlewares
app.use(express.json());

// Route principale
app.get('/', (req, res) => {
  res.json({
    message: 'API Pokemon Simple - POO avec TypeScript',
    description: 'Système de jeu Pokémon simplifié selon la consigne',
    endpoints: {
      pokemon: '/api/pokemon',
      battles: '/api/battles'
    },
    battleTypes: {
      'Défi aléatoire': 'POST /api/battles/random-challenge',
      'Défi déterministe': 'POST /api/battles/deterministic-challenge', 
      'Arène 1 (100 combats aléatoires)': 'POST /api/battles/arena1',
      'Arène 2 (combats déterministes)': 'POST /api/battles/arena2'
    }
  });
});

app.use('/api/pokemon', pokemonRoutes);
app.use('/api/battles', battleRoutes);

app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API Pokemon fonctionnelle !',
    features: [
      '✅ Classes POO (Pokemon, Attack, Trainer)',
      '✅ Gestion des attaques (max 4, sans doublon, limite usage)',
      '✅ Système de soins complet',
      '✅ Combats aléatoires et déterministes',
      '✅ Arènes avec système de niveau/expérience',
      '✅ API REST complète'
    ],
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Serveur Pokemon API démarré sur http://localhost:${PORT}`);
  console.log(`Page d'accueil: http://localhost:${PORT}`);
  console.log(`Test API: http://localhost:${PORT}/api/test`);
  console.log(`Défi aléatoire: POST http://localhost:${PORT}/api/battles/random-challenge`);
  console.log(`Défi déterministe: POST http://localhost:${PORT}/api/battles/deterministic-challenge`);
  console.log(`Arène 1: POST http://localhost:${PORT}/api/battles/arena1`);
  console.log(`Arène 2: POST http://localhost:${PORT}/api/battles/arena2`);
});

export default app;
