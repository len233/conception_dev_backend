const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  console.log(req.headers) 
  console.log(req.body)
  res.send('Hello World!')
})

app.get('/some-html', (req, res) => {
  res.send('<html><body><h1>bonjour html</h1></body></html>')
})

app.get('/some-json',function (req, res){
  res.json({age: '22', nom : 'Jane'})
})

app.get('/transaction',function (req, res){
  res.json({ tableau: [100, 2000, 3000] })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// j'ai fait une modif dans le get de la route / en ajoutant un console log pour afficher les headers et le body de la requete

// le headers il affiche plein d'informations sur la requete et le body il est vide car dans une requete get on envoie pas de body donc il affiche undefined