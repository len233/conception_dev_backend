const express = require('express')
const app = express()
const port = 3000

const loggerMiddleware = (req, res, next) => {
    console.log("nouvelle requête entrante");
}
app.use(loggerMiddleware);


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

// --------------------------------//

app.use(express.json());

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
