import axios from "axios";
import { useStateContext } from "./context/ContextProvider.jsx";

// Get API_URL from environment or use a default value
const API_URL = import.meta.env.API_URL || 'http://localhost:8000';

const axiosClient = axios.create({
  baseURL: `${API_URL}/api`
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ACCESS_TOKEN');
  //const refreshtoken = localStorage.getItem('REFRESH_TOKEN')
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use((response) => {
  return response;
}, (error) => {
  const { response } = error;
  if (response.status === 401) {
    localStorage.removeItem('ACCESS_TOKEN');
    // window.location.reload();
  } else if (response.status === 404) {
    //Show not found
  }

  throw error;
});

export default axiosClient;
