import axios from "axios";

const baseUrl = '/api/auth/login'
const KEY = 'user';

const login = async(credentials) =>{
  const response = await axios.post(baseUrl,credentials)
  return response.data
}

const saveUserDetails = (user) =>{
  window.localStorage.setItem(KEY, user)
}

const logout = () =>{
  window.localStorage.removeItem(KEY)
}

export default {login, saveUserDetails,logout}