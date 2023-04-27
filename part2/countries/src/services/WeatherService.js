import axios from "axios"

const OPEN_WEATHER_API_KEY =  process.env.REACT_APP_API_KEY

const getWeatherByLatAndLon = async (lat,lon) =>{
    const endpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_API_KEY}`
    const request = axios.get(endpoint)
    const response = await request;
    return response.data
}

const getWeatherIcon =(icon) =>{
    return `https://openweathermap.org/img/w/${icon}.png`;
}

export default{
    getWeatherIcon,
    getWeatherByLatAndLon
}