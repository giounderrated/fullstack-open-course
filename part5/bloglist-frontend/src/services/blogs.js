import axios from 'axios'

const baseUrl = '/api/blogs'
let token
const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (newBlog) => {
  const response = await axios.post(baseUrl, newBlog, getHeaders())
  return response.data
}

const update = async (blogToUpdate) => {
  const endpoint = `${baseUrl}/${blogToUpdate.id}`
  const response = await axios.put(endpoint, blogToUpdate, getHeaders())
  return response.data
}

const remove = async (blogId) => {
  const endpoint = `${baseUrl}/${blogId}`
  await axios.delete(endpoint, getHeaders())
}

const getHeaders = () => {
  return {
    headers: { Authorization: token },
  }
}

export default { getAll, create, update, remove, setToken }
