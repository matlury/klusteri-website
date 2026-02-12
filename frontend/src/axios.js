import axios from "axios";

// Get API_URL from environment or use a default value
const API_URL = process.env.VITE_API_URL || "http://localhost:8000/api/";

const axiosClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;

    // If session is invalid or expired (401), route to a public page
    if (response && response.status === 401) {
      const publicRoutes = [
        "/",
        "/etusivu",
        "/christina_regina",
        "/varaukset",
        "/yhteystiedot",
        "/saannot_ja_ohjeet",
        "/tietosuojaseloste"
      ];

      // Normalize current path for comparison (remove trailing slash)
      const currentPath = window.location.pathname === "/"
        ? "/"
        : window.location.pathname.replace(/\/$/, "");

      const isPublic = publicRoutes.some(route => {
        const normalizedRoute = route === "/" ? "/" : route.replace(/\/$/, "");
        return normalizedRoute === currentPath;
      });

      if (!isPublic) {
        window.location.href = "/";
      } else {
        // Just reload to clear React state if we are on a public page
        window.location.reload();
      }
    }

    throw error;
  },
);

export default axiosClient;