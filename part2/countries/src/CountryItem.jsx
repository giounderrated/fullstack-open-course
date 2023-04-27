import { useEffect, useState } from "react";
import WeatherService from "./services/WeatherService";

export const CountryItem = ({ country }) => {
  
    const [icon, setIcon] = useState("")
    const [weather,setWeather] = useState(null)
    useEffect(()=>{
        const coordenates = country.capitalInfo.latlng;
        WeatherService.getWeatherByLatAndLon(coordenates[0], coordenates[1]).then(weather=>{
            setWeather(weather);
            setIcon(WeatherService.getWeatherIcon(weather.weather[0].icon))
            console.log(weather.weather[0].icon);
        })
    },[])
    
    return (
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
      <div>
        <img src={country.flags.png} alt={country.name.common} />
      </div>
      {
        weather && 
        <div>
            <h1>Weather in {country.capital[0]}</h1>
            <p>Temperature {weather.main.temp} Celcius</p>
            <img src={icon} alt="" width={50} />
            <p>Wind {weather.wind.speed} m/s </p>
        </div>
      }
    </div>
  );
};
