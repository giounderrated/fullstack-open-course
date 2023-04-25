import { useState } from "react";

export const Form = ({ handleSubmit }) => {
    
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");

  return (
    <form onSubmit={(event)=>handleSubmit(event,newName,newPhone)}>
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
  );
};
