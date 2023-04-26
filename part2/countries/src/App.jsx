import "./App.css";
import { useEffect, useState } from "react";
import CountriesService from "./services/CountriesService";
const App = () => {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    CountriesService.getAll().then((countries) => setCountries(countries));
  }, []);

  const handleChange = (event) => {
    setSearch(event.target.value);
    CountriesService.getByName(search).then((countries) => {
      setCountries(countries);
    });
  };

  return (
    <div>
      <p>
        find countries
        <input
          type="text"
          value={search}
          onChange={(event) => handleChange(event)}
        />
      </p>
      {countries.length > 10 && <p>Too many countries, add another filter</p>}
      {countries.length < 10 && countries.length>1 &&
        countries.map((country) => (
          <li key={country.name.common}> {country.name.common} </li>
        ))}
      {countries.length == 1 &&
        countries.map((country) => (
          <div>
            <h1>{country.name.common}</h1>
            <p>Capital {country.capital}</p>
            <p>Area {country.area}</p>
            <h4>Languages</h4>
            <ul>
              {Object.keys(country.languages).map((key) => (
                <li key={key}> {country.languages[key]} </li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
};

export default App;
