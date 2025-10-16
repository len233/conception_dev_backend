const express = require('express')
const { v4: uuidv4 } = require('uuid')
const { 
    getRegisteredUsers, 
    checkCredentials,
    checkCredentialsAsync, 
    addAuthenticatedUser, 
    isTokenValid, 
    getUserByToken,
    newUserRegistered,
    getUserRole
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

app.get('/hello', (req, res) => {
  res.send('<h1>hello</h1>')
})

const requireRole = (requiredRole) => {
    return (req, res, next) => {
        const token = req.headers.authorization;
        
        if (!token || !isTokenValid(token)) {
            return res.status(403).json({ message: 'Token invalide' });
        }
        
        const user = getUserByToken(token);
        const userRole = getUserRole(user.email);
        
        if (requiredRole === 'admin' && userRole !== 'admin') {
            return res.status(403).json({ 
                message: 'Accès refusé - Privilèges administrateur requis' 
            });
        }
        
        req.userEmail = user.email;
        req.userRole = userRole;
        next();
    };
};

app.get('/restricted1', (req, res) => {
  res.json({ message: 'topsecret' });
})

app.get('/restricted2', (req, res) => {
  res.send('<h1>Admin space</h1>');
})

app.get('/admin-only', requireRole('admin'), (req, res) => {
    res.json({ 
        message: 'Zone administrateur',
        user: req.userEmail,
        role: req.userRole
    });
})

app.get('/profile', (req, res) => {
    const token = req.headers.authorization;
    
    if (!token || !isTokenValid(token)) {
        return res.status(403).json({ message: 'Token requis' });
    }
    
    const user = getUserByToken(token);
    const userRole = getUserRole(user.email);
    
    res.json({ 
        email: user.email,
        role: userRole,
        message: 'Profil utilisateur'
    });
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
    const urls = ['/', '/hello', '/some-html', '/some-json', '/transaction', '/authenticate', '/register'];
    
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


app.post('/authenticate', async (req, res) => {
    console.log("Tentative d'authentification");
    
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ 
            message: 'Email et mot de passe requis' 
        });
    }
    
    console.log(`Tentative de connexion pour: ${email}`);
    
    try {
        // Utiliser la fonction asynchrone pour supporter les mots de passe hashés
        const isValid = await checkCredentialsAsync(email, password);
        
        if (!isValid) {
            console.log("Identifiants invalides");
            return res.status(403).json({ 
                message: 'Email ou mot de passe incorrect' 
            });
        }
        
        console.log("Authentification réussie");
        
        const token = uuidv4();
        const userRole = getUserRole(email);
        
        addAuthenticatedUser(token, email);
        
        console.log(`Token généré pour ${email}: ${token}`);
        
        res.json({ 
            message: 'Authentification réussie',
            token: token,
            email: email,
            role: userRole
        });
    } catch (error) {
        console.error("Erreur lors de l'authentification:", error);
        res.status(500).json({ 
            message: 'Erreur interne du serveur' 
        });
    }
});

app.post('/register', async (req, res) => {
    console.log("Tentative d'inscription");
    
    const { email, password, role } = req.body;
    
    // Validation des champs requis
    if (!email || !password) {
        return res.status(400).json({ 
            message: 'Email et mot de passe requis' 
        });
    }

    // Validation de l'email (basique)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 
            message: 'Format d\'email invalide' 
        });
    }

    if (password.length < 6) {
        return res.status(400).json({ 
            message: 'Le mot de passe doit contenir au moins 6 caractères' 
        });
    }
    
    console.log(`Tentative d'inscription pour: ${email}`);
    
    try {
        const result = await newUserRegistered(email, password, role || 'user');
        
        if (result.success) {
            console.log("Inscription réussie");
            res.status(201).json({ 
                message: result.message,
                email: email,
                role: role || 'user'
            });
        } else {
            console.log("Échec de l'inscription:", result.message);
            res.status(409).json({ 
                message: result.message 
            });
        }
    } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        res.status(500).json({ 
            message: 'Erreur interne du serveur' 
        });
    }
});