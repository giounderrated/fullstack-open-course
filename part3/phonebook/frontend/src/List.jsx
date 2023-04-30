import { ListItem } from "./ListItem";
import PersonService from "./services/PersonService";

export const List = ({ persons, handleDelete }) => {
  return (
    <div>
      <h1>Numbers</h1>
      <ul>
        {persons.map((person) => (
          <ListItem
            key={person.id}
            id={person.id}
            name={person.name}
            number={person.number}
            handleDelete={() => handleDelete(person.id)}
          />
        ))}
      </ul>
    </div>
  );
};
