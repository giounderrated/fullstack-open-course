import axios from "axios";

const baseUrl = "https://restcountries.com/v3.1";
const getAll = async () =>{
    const request = axios.get(`${baseUrl}/all`);
    const response = await request
    return response.data;
}

/* https://restcountries.com/v3.1/name/mexico */
const getByName = async(name) =>{
    const request = axios.get(`${baseUrl}/name/${name}`)
    const response = await request;
    return response.data;
}


export default {
    getAll,
    getByName
}