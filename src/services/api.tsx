import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7086/api'
});

export default api;