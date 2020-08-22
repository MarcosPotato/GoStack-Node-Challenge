const express = require("express");
const cors = require("cors");

const { uuid, isUuid  } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const { title } = request.query
  const result = title ? repositories.filter(repository => repository.title.includes(title)) : repositories 
  
  return response.status(200).json(result)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(newRepository)

  return response.status(200).json(newRepository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  if(!isUuid(id))
    return response.status(400).json({ error: "This isn't valid id" })

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)
  
  if(repositoryIndex === -1)
    return response.status(400).json({ error: "Repository not found" })
    const updatedRepository = {
     id,
     title,
     url,
     techs,
     likes: repositories[repositoryIndex].likes
    }
   
    repositories[repositoryIndex] = updatedRepository
    return response.json(updatedRepository)
   

  //Alteration
  /*let updateTechs = repositories[repositoryIndex].techs

  techs.forEach(tech => {
    if(!updateTechs.find(data => data === tech))
      updateTechs.push(tech)
  })

  const updatedRepository = {
    id,
    title: title || repositories[repositoryIndex].title,
    url: url || repositories[repositoryIndex].url,
    techs: updateTechs,
    likes: repositories[repositoryIndex].likes
  }

  repositories[repositoryIndex] = updatedRepository

  return response.json(updatedRepository)*/
  
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  if(!isUuid(id))
    return response.status(400).json({ error: "This isn't valid id" })

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)
  
  if(repositoryIndex < 0)
    return response.status(400).json({ error: "Repository not found" })

  repositories.splice(repositoryIndex, 1)

  return response.status(204).json({})
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  if(!isUuid(id))
    return response.status(400).json({ error: "This isn't valid id" })

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)
  
  if(repositoryIndex < 0)
    return response.status(400).json({ error: "Repository not found" })

  repositories[repositoryIndex].likes += 1


  return response.status(200).json(repositories[repositoryIndex])
});

module.exports = app;
