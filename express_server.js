const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/some-html', (req, res) => {
    const code = `<html><body><h1>bonjour html</h1></body></html>`;
    res.send(code)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


// Cela marche, en ajoutant le chemin /some-html dans l'url, il affiche bien le message 'bonjour html' 