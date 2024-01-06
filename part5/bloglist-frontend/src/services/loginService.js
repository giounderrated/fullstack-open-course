import axios from 'axios'

const baseUrl = '/api/auth/login'
const USER_KEY = 'user'

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

const saveUserDetails = (user) => {
  window.localStorage.setItem(USER_KEY, JSON.stringify(user))
}

const getLoggedUser = () => {
  return JSON.parse(window.localStorage.getItem(USER_KEY))
}

const logout = () => {
  window.localStorage.removeItem(USER_KEY)
}

export default { login, saveUserDetails, logout, getLoggedUser }
