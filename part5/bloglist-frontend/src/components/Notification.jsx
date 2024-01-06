export const Notification = ({ message }) => {
  const styles = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16,
    borderColor:'green',
    border: 2
  }

  if (!message) {
    return null
  }
  return <div style={styles}>{message}</div>
}