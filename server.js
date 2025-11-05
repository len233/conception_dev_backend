const express = require('express');
const { average } = require('./lib');
const app = express();

app.use(express.json());

app.post('/average', (req, res) => {
  try {
    const { numbers } = req.body;
    
    if (!Array.isArray(numbers)) {
      return res.status(400).json({ error: 'Le champ "numbers" doit être un tableau' });
    }
    
    if (numbers.length === 0) {
      return res.status(400).json({ error: 'Le tableau ne peut pas être vide' });
    }
    
    if (!numbers.every(num => typeof num === 'number' && !isNaN(num))) {
      return res.status(400).json({ error: 'Tous les éléments du tableau doivent être des nombres' });
    }
    
    const result = average(numbers);
    
    res.json({ average: result });
    
  } catch (error) {
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = app;
