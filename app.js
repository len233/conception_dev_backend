// Fichier optionnel pour démarrer le serveur en production
const app = require('./server');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur Express démarré sur le port ${PORT}`);
  console.log(`Test avec: curl -X POST http://localhost:${PORT}/average -H "Content-Type: application/json" -d '{"numbers":[1,2,3,4]}'`);
});
