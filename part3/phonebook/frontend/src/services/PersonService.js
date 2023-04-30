import axios from "axios";

const baseUrl ="/api/v1/persons";

const getAll = async () => {
  const request = axios.get(baseUrl);
  const response = await request;
  return response.data;
};

const create = async (data) => {
  const request = axios.post(baseUrl, data);
  const response = await request;
  return response.data;
};

const update = async (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  const response = await request;
  return response.data;
};

const remove = async (id) =>{
    const request = axios.delete(`${baseUrl}/${id}`);
    const response = await request;
    return response.data;
}

export default {
  getAll,
  create,
  update,
  remove
};
