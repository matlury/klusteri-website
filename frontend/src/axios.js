import axios from "axios";

// Get API_URL from environment or use a default value
const API_URL = process.env.VITE_API_URL;

// Normalize baseURL: 
// - If API_URL is '/' or empty, we want '/api'
// - If API_URL already ends with '/api', use it as is
// - Otherwise, append '/api'
const baseURL = (API_URL === '/' || !API_URL) 
  ? '/api' 
  : (API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`);

const axiosClient = axios.create({
  baseURL: baseURL,
});

// Checks the authorization of the user using axios

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ACCESS_TOKEN");

  if (token && token !== "undefined" && token !== "null") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;

    // If token is invalid or expired (401), clear local storage
    if (response && response.status === 401) {
      localStorage.removeItem("ACCESS_TOKEN");
      localStorage.removeItem("loggedUser");

      // Optional: Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = "/login";
      }
    }

    throw error;
  },
);

export default axiosClient;