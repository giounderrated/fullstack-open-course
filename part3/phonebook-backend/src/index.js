const express = require("express");
const morgan = require("morgan")
const cors = require('cors')

const app = express();

const PORT = process.env.PORT || 3001

morgan.token('body', (request,response)=>{
  const body  = request.body ? request.body : {} 
 return JSON.stringify(body)
})

const logger = morgan(':method :url :status :res[content-length] - :response-time ms :body')


app.use(express.json());
app.use(logger)
app.use(cors())


let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/info", (request, response) => {
  const message = `Phonebook has info for ${persons.length} people`;
  const html = `<p>${message}</p><p>${new Date()}</p>`;
  response.send(html);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id === id);

  if (!person) response.status(404).end();

  response.json(person);
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    response.status(400).json({
      error: "Malformed data ",
    });
  }

  if (persons.find((person) => person.name === body.name)) {
    response.status(400).json({
      error: "Name must be unique",
    });
  }

  const newPerson = {
    id: Math.floor(Math.random() * 1000),
    name: body.name,
    number: body.number,
  };

  persons = [...persons, newPerson];
  response.status(201).json(newPerson).end();
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id === id);

  if (!person) {
    response.status(404).end();
  }
  persons = persons.filter((person) => person.id != id);
  response.status(201).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
