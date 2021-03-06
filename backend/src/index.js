const express = require('express');
const { uuid, isUuid }= require('uuidv4');
const cors= require('cors');

const app= express();
app.use(cors());
app.use(express.json());

const projects= []

function logRequests(request, response, next){
    const { method, url } = request

    const logLabel= `[${method.toUpperCase()}] ${url}`

    console.time(logLabel)

    next() //proximo middleware

    console.timeEnd(logLabel)
}

function validateProjectId(request, response, next){
    const { id } = request.params;

    if(!isUuid(id)){
        return response.status(400).json({ "error": 'Invalid project ID'});
    }

    return next();
}

app.use(logRequests)
app.use('/projects/:id', validateProjectId) //Ao invés de adicionar o middleware nas rotas, podemos definir qual é o formato da rota e o middleware é executado nessas rotas

app.get('/projects', (request, response) => { //projects seria o recurso
    const { title }= request.query

    const result = title 
        ? projects.filter(project => project.title.includes(title))
        : projects
    
    return response.json(result);
})

app.post('/projects', (request, response) => {
    const {title, owner}= request.body

    const project= {id: uuid(), title, owner}
    projects.push(project);
    
    return response.json(project)
})

app.put('/projects/:id', (request, response) => { //no caso do put, passamos um identificador porque nao queremos atualizar TODOS os projetos
    const {id}= request.params;
    const {title, owner}= request.body
    const projectIndex = projects.findIndex(project => project.id === id)

    if(projectIndex < 0){
        return response.status(400).json({ "error": 'Project not found' })
    }

    const project = {id, title, owner}

    projects[projectIndex]= project

    return response.json(project)
})

app.delete('/projects/:id', (request, response) => { //no caso do put, passamos um identificador porque nao queremos deletar TODOS os projetos
    const {id}= request.params;
    const projectIndex= projects.findIndex(project => project.id === id)
    
    if(projectIndex < 0){
        return response.status(400).json({ "error": 'Project not found' })
    }

    projects.splice(projectIndex, 1)

    return response.status(204).send() //send() retorna nada
})

app.listen(3333, () => {
    console.log("backend started in http://localhost:3333") //abrir aplicação numa rota com porta 3333
}); 