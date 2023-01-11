const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())
morgan.token('dataSent', function (req, res) {
  if (Object.keys(req.body).length !== 0) {
    return JSON.stringify(req.body)
  } else {
    return ''
  }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :dataSent'))

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  let id = Number(request.params.id)
  let p = persons.find(person => person.id === id)
  if (p) {
    response.json(p)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  let id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204)
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name is missing' 
    })
  } else if (!body.number) {
    return response.status(400).json({ 
      error: 'number is missing' 
    })
  } else if (persons.find(p => p.name === body.name)) {
    return response.status(400).json({ 
      error: 'name already exists' 
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 1000),
  }

  persons = persons.concat(person)
  response.json(person)
})

app.get('/info', (request, response) => {
  let d = new Date()
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${d}</p>`)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
