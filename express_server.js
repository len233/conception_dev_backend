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

app.get('/exo-query-string', (req, res) => {
  console.log(req.query)
//   res.send('hello')
  res.send(`<h1>${req.query.age}</h1>`)
})

app.get('/get-user/:userId', (req, res) => {
  console.log(req.params)
  res.send(`<h1>${req.params.userId}</h1>`)
})  

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// il affiche :userId avec l'url /get-user/:userId, et affiche pareil dans le terminal { userId: ':userId' }

// il affiche :userId avec l'url /get-user/2, et affiche dans le terminal { userId: '2' } et dans le web il affiche 2 (pareil pour 3 ou autre)


