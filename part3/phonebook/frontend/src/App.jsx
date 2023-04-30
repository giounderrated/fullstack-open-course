import { useEffect, useState } from "react";
import { List } from "./List";
import { Notification } from "./Notification";
import { Error } from "./Error";

import PersonService from "./services/PersonService";
import { Form } from "./Form";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    PersonService.getAll().then((initialPersons) => setPersons(initialPersons));
  }, []);

  const [filter, setFilter] = useState("");

  const handleSubmit = (event, ...data) => {
    event.preventDefault();
    const name = data[0];
    const number = data[1];

    const newPerson = {
      id: persons.length + 1,
      name,
      number,
    };

    if (persons.find((person) => person.name == newPerson.name) == null) {
      PersonService.create(newPerson).then((created) => {
        setPersons([...persons, created]);
        setMessage("Person was added successfully");
        setTimeout(()=>setMessage(""),5000)
      });
      return;
    }
    const confirm = window.confirm(
      `${newPerson.name} is already added to the phonebook, replace the oldnumber with a new one`
    );

    if (!confirm) return;

    const person = persons.find((person) => person.name == newPerson.name);
    const updatedPerson = { ...person, number: newPerson.number };

    PersonService.update(person.id, updatedPerson).then((updated) => {
      setPersons(
        persons.map((person) => (person.id != updated.id ? person : updated))
      );
      setMessage("Information updated successfully")
      setTimeout(()=>setMessage(""),5000);
    })
    .catch(error=>{
      setError("There was a problem during updating");
      setTimeout(()=>setError(""),5000)
    })
  };

  const handleDelete = (id) => {
    const person = persons.find(person=>person.id ==id)
    window.confirm(`Are you sure you want to delete  ${person.name}`);
    PersonService.remove(id).then((removed) => {
      setPersons(persons.filter((person) => person.id != id));
    })
    .catch(error=>{
      setError(`Information from ${person.name} has already been removed`);
      setTimeout(()=>setError(""),5000)
    })
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message}/>
      <Error error={error}/>
      <p>
        Filter shown with
        <input
          type="text"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        />
      </p>
      <Form handleSubmit={handleSubmit} />
      {filter ? (
        <List
          persons={persons.filter((person) =>
            person.name.toLowerCase().includes(filter.toLowerCase())
          )}
          handleDelete={handleDelete}
        />
      ) : (
        <List persons={persons} handleDelete={handleDelete} />
      )}
    </div>
  );
};

export default App;
