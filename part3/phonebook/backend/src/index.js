const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const Person = require("./models/Person.model");

const app = express();

const PORT = process.env.PORT || 3001;

morgan.token("body", (request, response) => {
  const body = request.body ? request.body : {};
  return JSON.stringify(body);
});

const logger = morgan(
  ":method :url :status :res[content-length] - :response-time ms :body"
);

app.use(express.static("build"));
app.use(express.json());
app.use(logger);
// app.use(cors())

app.get("/info", (request, response) => {
  Person.count().then((result) => {
    const message = `Phonebook has info for ${result} people`;
    const html = `<p>${message}</p><p>${new Date()}</p>`;
    response.send(html);
  });
});

app.get("/api/v1/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/v1/persons/:id", (request, response) => {
  const id = String(request.params.id);
  Person.findById(id)
    .then((person) => {
      if (!person) {
        response.status(404).json({ error: "Person was not found" }).end();
      } else {
        response.json(person);
      }
    })
    .catch((error) => {
      console.log(error);
      response.status(400).send({ error: "malformatted id" });
    });
});

app.post("/api/v1/persons", (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Malformed data",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((newPerson) => {
      response.status(201).json(newPerson);
    })
    .catch((error) => next(error));
});

app.put("/api/v1/persons/:id", (request, response, next) => {
  const id = request.params.id;
  const body = request.body;
  const newPerson = {
    name: body.name,
    number: body.number,
  };
  Person.findByIdAndUpdate(id, newPerson, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.delete("/api/v1/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findByIdAndRemove(id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  console.error(error);

  if (error.name === "CastError") {
    return response.status(401).json({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(401).json({ error: error.message });
  }
  return response.status(401).json({error:error})
};

app.use(unknownEndpoint);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
