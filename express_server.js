const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
//   res.send('Hello World!')
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


// Cela ne marche plus, car il n'arrive pas recevoir les requetes (récupérer les infos de la requete) et donc ne peut pas répondre (client ne reçoit rien, en attente d'une réponse)