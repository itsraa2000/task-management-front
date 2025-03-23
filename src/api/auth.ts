import api from "./axios"

export interface RegisterData {
  username: string
  email: string
  password: string
  password_confirm: string
  first_name: string
  last_name: string
}

export interface LoginData {
  username: string
  password: string
}

export interface AuthResponse {
  access: string
  refresh: string
}

export interface UserProfile {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  profile?: {
    bio: string | null
    avatar: string | null
  }
}

export const authApi = {
  register: async (data: RegisterData) => {
    const response = await api.post<UserProfile>("/auth/register/", data)
    return response.data
  },

  login: async (data: LoginData) => {
    const response = await api.post<AuthResponse>("/auth/login/", data)
    // Store tokens in localStorage
    localStorage.setItem("accessToken", response.data.access)
    localStorage.setItem("refreshToken", response.data.refresh)
    return response.data
  },

  logout: () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
  },

  getCurrentUser: async () => {
    const response = await api.get<UserProfile>("/auth/me/")
    return response.data
  },

  updateProfile: async (data: Partial<UserProfile>) => {
    const response = await api.put<UserProfile>("/auth/profile/", data)
    return response.data
  },

  changePassword: async (oldPassword: string, newPassword: string, confirmPassword: string) => {
    const response = await api.post("/auth/change-password/", {
      old_password: oldPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    })
    return response.data
  },

  searchUsers: async (query: string) => {
    const response = await api.get<UserProfile[]>(`/auth/search/?q=${query}`)
    return response.data
  },
}

