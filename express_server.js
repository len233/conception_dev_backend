const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
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


// Cela marche, en ajoutant le chemin /transaction dans l'url, il affiche bien le tableau avec les 3 valeurs (dans postman aussi)

