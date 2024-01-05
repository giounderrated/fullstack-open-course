export const Error = ({ error }) => {
  const styles = {
    color: "red",
    fontStyle: "italic",
    fontSize: 16,
    borderColor:"red",
    border: 2
  };
  if (!error) {
    return null;
  }
  return <div style={styles}>{error}</div>;
};
