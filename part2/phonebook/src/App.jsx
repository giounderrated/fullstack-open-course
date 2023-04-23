import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", phone: "040-123456", id: 1 },
    { name: "Ada Lovelace", phone: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", phone: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", phone: "39-23-6423122", id: 4 },
  ]);

  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [filter, setFilter] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName,
      phone: newPhone,
    };

    if (persons.find((person) => person.name == newName) == null) {
      setPersons([...persons, newPerson]);
      setNewName("");
      setNewPhone("");
      return;
    }
    alert(`${newName} is already added to phonebook`);
    setNewName("");
    setNewPhone("");
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <p>
        Filter shown with{" "}
        <input
          type="text"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        />
      </p>
      <form onSubmit={handleSubmit}>
        name
        <input
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
        />
        number
        <input
          value={newPhone}
          onChange={(event) => setNewPhone(event.target.value)}
        />
        <button type="submit">add</button>
      </form>
      <h2>Numbers</h2>
      <ul>
        {filter
          ? persons
              .filter((person) =>
                person.name.toLowerCase().includes(filter.toLowerCase())
              )
              .map((person) => (
                <li key={person.name}>
                  {" "}
                  {person.name} {person.phone}
                </li>
              ))
          : persons.map((person) => (
              <li key={person.name}>
                {" "}
                {person.name} {person.phone}
              </li>
            ))}
      </ul>
    </div>
  );
};

export default App;
