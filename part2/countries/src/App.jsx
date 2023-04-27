import { useEffect, useState } from "react";
import CountriesService from "./services/CountriesService";
import { CountryItem } from "./CountryItem";
import "./index.css";
const App = () => {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);
  const [selected, setSelected] = useState();
  useEffect(() => {
    CountriesService.getAll().then((countries) => setCountries(countries));
  }, []);

  const handleChange = (event) => {
    setSearch(event.target.value);
    CountriesService.getByName(search)
      .then((countries) => {
        setCountries(countries);
        setSelected(null);
      })
      .catch((error) => console.log(error));
  };

  const showCountry = (name) => {
    const country = countries.find((country) => country.name.common == name);
    setSelected(country);
  };

  return (
    <div className="container">
      <div>
        <p>
          find countries
          <input
            type="text"
            value={search}
            onChange={(event) => handleChange(event)}
          />
        </p>
      </div>
      <div>
        {countries.length > 10 && <p>Too many countries, add another filter</p>}
        {countries.length < 10 &&
          countries.map((country) => (
            <li key={country.population}>
              {country.name.common}
              <button onClick={() => showCountry(country.name.common)}>
                show
              </button>
            </li>
          ))}
        {selected && <CountryItem country={selected} />}
        {countries.length == 1 && <CountryItem country={countries[0]} />}
      </div>
    </div>
  );
};

export default App;
