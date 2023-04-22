import "./App.css";
import { useState } from "react";

const Button = (props) => (
  <button onClick={props.handleClick}>{props.title}</button>
);

const StatisticsLine = (props) => {
  return (
    <>
      <tr>
        <td>{props.title}</td>
        <td>{props.value}</td>
      </tr>
    </>
  );
};

const Statistics = (props) => {
  if (props.total == 0) return <div>No feedback given</div>;

  return (
    <div>
      <h1>Statistics</h1>
      <StatisticsLine title="good" value={props.good} />
      <StatisticsLine title="neutral" value={props.neutral} />
      <StatisticsLine title="bad" value={props.bad} />
      <StatisticsLine title="total" value={props.total} />
      <StatisticsLine
        title="average"
        value={(props.good + props.bad * -1) / props.total}
      />
      <StatisticsLine
        title="positive"
        value={(props.good / props.total) * 100}
      />
    </div>
  );
};

function App() {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [total, setTotal] = useState(0);

  const addGood = () => {
    setGood(good + 1);
    setTotal(total + 1);
  };

  const addNeutral = () => {
    setNeutral(neutral + 1);
    setTotal(total + 1);
  };

  const addBad = () => {
    setBad(bad + 1);
    setTotal(total + 1);
  };

  return (
    <div>
      <h1>give feedback</h1>
      <Button title="good" handleClick={addGood} />
      <Button title="neutral" handleClick={addNeutral} />
      <Button title="bad" handleClick={addBad} />
      <Statistics good={good} bad={bad} neutral={neutral} total={total} />
    </div>
  );
}

export default App;
