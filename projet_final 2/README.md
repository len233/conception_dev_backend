# StockLink Pro API

API pour la gestion d'entrepôts avec authentification JWT et bases de données PostgreSQL + MongoDB.

## Installation

### 1. Cloner et installer
```bash
npm install
```

### 2. Configuration des variables d'environnement
```bash
cp .env.example .env
```

Configurer les variables dans `.env` :
- `POSTGRES_*` : Configuration PostgreSQL
- `MONGODB_URI` : URI de connexion MongoDB  
- `JWT_SECRET` : Clé secrète JWT

### 3. Initialiser les bases de données

**PostgreSQL :**
```bash
psql -U your_username -d stocklink -f database.sql
```

**MongoDB :**
Démarrer MongoDB sur le port par défaut 27017.

## Démarrage
```bash
npm run dev    # Développement
npm start      # Production
npm test       # Tests
```

**API :** http://localhost:3000/api  
**Documentation :** http://localhost:3000/docs

## Structure

```
src/
├── config/          # Configuration (DB, Swagger)
├── controllers/     # Contrôleurs MVC  
├── middleware/      # Middlewares (auth, validation)
├── models/          # Modèles de données
├── routes/          # Définition des routes
├── app.ts          # Configuration Express
└── server.ts       # Point d'entrée
```

## Routes API Principales

### Authentification
- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Se connecter

### Entrepôts (PostgreSQL)
- `GET /api/warehouses` - Liste des entrepôts
- `POST /api/warehouses` - Créer un entrepôt
- `GET /api/warehouses/:id` - Détails d'un entrepôt
- `PUT /api/warehouses/:id` - Modifier un entrepôt
- `DELETE /api/warehouses/:id` - Supprimer un entrepôt

### Produits (PostgreSQL)
- `GET /api/products` - Liste des produits
- `POST /api/products` - Créer un produit
- `PUT /api/products/:id` - Modifier un produit
- `DELETE /api/products/:id` - Supprimer un produit

### Mouvements (PostgreSQL)
- `GET /api/movements` - Historique des mouvements
- `POST /api/movements` - Créer un mouvement

### Emplacements (MongoDB)
- `GET /api/warehouses/:id/locations` - Emplacements d'un entrepôt
- `POST /api/warehouses/:id/locations` - Créer un emplacement
- `PUT /api/warehouses/:id/locations` - Modifier un emplacement


