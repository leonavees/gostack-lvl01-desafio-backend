const express = require('express');
const cors = require('cors');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateId(req, res, next){
    const { id } = req.params;
    
    if (!isUuid(id)){
        return res.status(400).json({ 
            error: 'Invalid repository ID.'
        });
    }

    return next();
}

app.get('/repositories', (req, res) => {
    return res.json(repositories);
});

app.post('/repositories', (req, res) => {
    const { title, url, techs } = req.body;

    const repository = {
        id: uuid(),
        title,
        url,
        techs,
        likes: 0
    }

    repositories.push(repository);

    return res.status(201).json(repository);
});

app.post('/repositories/:id/like', validateId, (req, res) => {
    const { id } = req.params;

    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    if (repositoryIndex < 0){
        return res.status(400).json({
            error: 'Repository not found'
        });
    }

    const repository = repositories[repositoryIndex];

    repository.likes++;
    repositories[repositoryIndex] = repository;

    return res.json(repository);
});

app.put('/repositories/:id', validateId, (req, res) => {
    const { id } = req.params;
    
    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    if (repositoryIndex < 0) {
        return res.status(400).json({
            error: 'Repository not found'
        });
    }

    const repository = {
        id,
        ...req.body,
        likes: repositories[repositoryIndex].likes
    }

    repositories[repositoryIndex] = repository;

    return res.json(repository);
});

app.delete('/repositories/:id', validateId, (req, res) => {
    const { id } = req.params;
    
    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    if (repositoryIndex < 0) {
        return res.status(400).json({
            error: 'Repository not found'
        });
    }

    repositories.splice(repositoryIndex, 1);

    return res.status(204).send();
});

module.exports = app;