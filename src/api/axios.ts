import axios from "axios";

const api = axios.create({
  baseURL: "https://task-management-back-rt82.onrender.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to refresh token on 401 error
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 Unauthorized and not retried already
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.warn("No refresh token found, redirecting to login...");
        localStorage.removeItem("accessToken");
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh token
        const { data } = await axios.post(
          "https://task-management-back-rt82.onrender.comZZ/api/auth/token/refresh/",
          { refresh: refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        // Store new token
        localStorage.setItem("accessToken", data.access);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
