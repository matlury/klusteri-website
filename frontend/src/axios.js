import axios from "axios";

// Get API_URL from environment or use a default value
const API_URL = process.env.VITE_API_URL;

const axiosClient = axios.create({
  baseURL: `${API_URL}/api`,
});

// Checks the authorization of the user using axios
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ACCESS_TOKEN");
  
  // Only add header if token exists and isn't "undefined" or "null" string
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