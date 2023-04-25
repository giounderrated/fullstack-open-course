export const ListItem = ({ id, name, number, handleDelete }) => {
  return (
    <li>
      {name} {number}
      <button key={id} onClick={handleDelete}>
        delete
      </button>
    </li>
  );
};
