//On veut faire un “echo serveur” avec une méthode POST. Un echo serveur est un serveur qui renvoie ce que le client à envoyé à l'identique. Cela nous permettra de nous familiariser avec les méthodes post. 
// Reprendre le fichier app.js précédent ou en créer un nouveau avec un serveur express. 
// Ajouter un endpoint /data de type POST qui devra renvoyer le contenu de req.body sous forme json  
// Ajouter égalemet un console.log de req.body
// Avec postman envoyer une requête POST avec du json. Les données récupérée devrait être vide. C'est normal
// ajouter app.use(express.json()); au debut de votre fichier après les import
// Relancer le serveur
// Relancer une requête avec postman et vérifier que désormais req.body n'est plus vide

const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/data', (req, res) => {
    console.log(req.body);
    res.json(req.body);
}); 