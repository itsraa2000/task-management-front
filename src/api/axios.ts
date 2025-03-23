import axios from "axios"

// Create an axios instance with default config
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If the error is 401 and we haven't already tried to refresh the token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refreshToken")
        if (!refreshToken) {
          // No refresh token, redirect to login
          window.location.href = "/login"
          return Promise.reject(error)
        }

        // Try to refresh the token
        const response = await axios.post("http://localhost:8000/api/auth/token/refresh/", {
          refresh: refreshToken,
        })

        // If successful, update the tokens
        const { access } = response.data
        localStorage.setItem("accessToken", access)

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${access}`
        return api(originalRequest)
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default api
