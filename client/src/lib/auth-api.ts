import apiClient from "./api-client"

export interface SignupData {
  name: string
  email: string
  password: string
  confirmationPassword: string
}

export interface LoginData {
  email: string
  password: string
}

export interface SignupResponse {
  status: number
  message: string
  userInfo: {
    id: number
    name: string
    email: string
  }
  token: string
}

export interface LoginResponse {
  status: number
  message: string
  userInfo: {
    id: number
    email: string
    name: string
    password: string
  }
  token: string
}

export interface LogoutResponse {
  status: number
  message: string
}

export interface AuthResponse {
  status: number
  data: {
    id: number
    email: string
    name: string
    password: string
    iat: number
  }
}

// Auth API functions
export const authApi = {
  signup: async (data: SignupData): Promise<SignupResponse> => {
    const response = await apiClient.post<SignupResponse>("/signup", data)
    return response.data
  },

  login: async (data: LoginData): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/login", data)
    return response.data
  },

  logout: async (): Promise<LogoutResponse> => {
    const response = await apiClient.post<LogoutResponse>("/logout")
    return response.data
  },

  getCurrentUser: async (): Promise<AuthResponse["data"]> => {
    const response = await apiClient.get<AuthResponse>("/auth")
    return response.data.data
  },
}

