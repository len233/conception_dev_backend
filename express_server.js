const express = require('express')
const { v4: uuidv4 } = require('uuid')
const { 
    getRegisteredUsers, 
    checkCredentials, 
    addAuthenticatedUser, 
    isTokenValid, 
    getUserByToken 
} = require('./inMemoryUserRepository')

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

// Route publique (non restreinte)
app.get('/hello', (req, res) => {
  res.send('<h1>hello</h1>')
})

// Routes restreintes (nécessitent un token)
app.get('/restricted1', (req, res) => {
  res.json({ message: 'topsecret' });
})

app.get('/restricted2', (req, res) => {
  res.send('<h1>Admin space</h1>');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// --------------------------------//

app.post('/data', (req, res) => {
    console.log(req.body);
    res.json(req.body);
});


let tasks = [];

app.get('/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/new-task', (req, res) => {
    const newTask = req.body;
    newTask.id = tasks.length ? tasks[tasks.length - 1].id + 1 : 1; 
    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.put('/update-task/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const updatedTask = req.body;
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
        tasks[taskIndex] = { id: taskId, ...updatedTask };
        res.json(tasks[taskIndex]);
    } else {
        res.status(404).json({ message: "Task not found" });
    }
});

app.delete('/delete-task/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
        const deletedTask = tasks.splice(taskIndex, 1);
        res.json(deletedTask[0]);
    } else {
        res.status(404).json({ message: "Task not found" });
    }
});         


// --------------------------------//

const loggerMiddleware = (req, res, next) => {
    console.log("nouvelle requête entrante");
    console.log("request.body dans loggerMiddleware:", req.body);
    next();
}


const headerMiddleware = (req, res, next) => {
    console.log("Headers de la requête:", req.headers);
    next();
}


const firewall = (req, res, next) => {
    const urls = ['/', '/hello', '/some-html', '/some-json', '/transaction', '/authenticate'];
    
    const requestedUrl = req.url.split('?')[0];
    
    console.log("URL demandée:", requestedUrl);
    console.log("URLs non restreintes:", urls);
    
    if (urls.includes(requestedUrl)) {
        console.log("URL non restreinte, accès autorisé");
        next(); 
    } else {
        console.log("URL restreinte, vérification du token");

        const token = req.headers.authorization;
        
        if (!token || !isTokenValid(token)) {
            console.log("Token invalide ou manquant");
            return res.status(403).json({ message: 'Accès refusé - Token requis' });
        }
        
        console.log("Token valide, accès autorisé");
        next(); 
    }
}

app.use(loggerMiddleware);
app.use(headerMiddleware);
app.use(firewall);
app.use(express.json());

app.use(express.static('templates'));
app.use(express.static('public'));

app.get('/hello', (req, res) => {
  res.send('<h1>hello</h1>')
})

app.get('/restricted1', (req, res) => {
  res.json({ message: 'topsecret' });
})

app.get('/restricted2', (req, res) => {
  res.send('<h1>Admin space</h1>');
})


app.post('/authenticate', (req, res) => {
    console.log("Tentative d'authentification");
    
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ 
            message: 'Email et mot de passe requis' 
        });
    }
    
    console.log(`Tentative de connexion pour: ${email}`);
    
    if (!checkCredentials(email, password)) {
        console.log("Identifiants invalides");
        return res.status(403).json({ 
            message: 'Email ou mot de passe incorrect' 
        });
    }
    
    console.log("Authentification réussie");
    
    const token = uuidv4();
    
    addAuthenticatedUser(token, email);
    
    console.log(`Token généré pour ${email}: ${token}`);
    
    res.json({ 
        message: 'Authentification réussie',
        token: token,
        email: email
    });
});