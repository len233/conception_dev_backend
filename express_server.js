const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/some-html', (req, res) => {
  res.send('<html><body><h1>bonjour html</h1></body></html>')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


// Cela marche, en ajoutant le chemin /some-html dans l'url, il affiche bien le message 'bonjour html' 

// et lrsque on essaie d"accéder avec /miou, on a bien le message 'Cannot GET /miou', et dans la console, on a bien le message d'erreur 404 (et dans postman j'ai bien 404 Not Found) 