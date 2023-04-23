import { Part } from "./Part";

export const Content = ({ parts }) => {

  const total = parts.reduce((accumaled,current)=> accumaled + current.exercises,0)
  console.log(total);

  return (
    <div>
      {parts.map(part => (
        <Part key={part.id} name={part.name} exercises={part.exercises} />
      ))}
      <b>Total of {total} exercises</b>
    </div>
  );
};
