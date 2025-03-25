import axios from "axios";

/**
 * Create an axios instance with the base URL from environment variables
 * Configures default settings and interceptors for API requests
 */
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "/api/v1",
});

// Log the API base URL for debugging
console.log(
  "API Base URL:",
  process.env.REACT_APP_API_BASE_URL || "http:/localhost:8080/api/v1"
);

/**
 * Request interceptor to include auth token in headers
 * Gets token from localStorage and adds it to Authorization header
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle common errors
 * Handles 401 Unauthorized errors by clearing auth data and redirecting
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Clear token and user data if unauthorized
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login if not already there
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/auth/login")
      ) {
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
