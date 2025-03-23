import api from "./axios"
import type { UserProfile } from "./auth"

export interface Task {
  id: number
  title: string
  description: string | null
  priority: "low" | "medium" | "high"
  status: "todo" | "in-progress" | "done"
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
  owner: UserProfile
  collaborators: UserProfile[]
}

export interface CreateTaskData {
  title: string
  description?: string
  priority?: "low" | "medium" | "high"
  status?: "todo" | "in-progress" | "done"
  start_date?: string
  end_date?: string
}

export const tasksApi = {
  getTasks: async () => {
    const response = await api.get<Task[]>("/tasks/")
    return response.data
  },

  getTask: async (id: number) => {
    const response = await api.get<Task>(`/tasks/${id}/`)
    return response.data
  },

  createTask: async (data: CreateTaskData) => {
    const response = await api.post<Task>("/tasks/", data)
    return response.data
  },

  updateTask: async (id: number, data: Partial<CreateTaskData>) => {
    const response = await api.put<Task>(`/tasks/${id}/`, data)
    return response.data
  },

  deleteTask: async (id: number) => {
    await api.delete(`/tasks/${id}/`)
  },

  addCollaborator: async (taskId: number, userId: number) => {
    const response = await api.post(`/tasks/${taskId}/add_collaborator/`, { user_id: userId })
    return response.data
  },

  removeCollaborator: async (taskId: number, userId: number) => {
    const response = await api.post(`/tasks/${taskId}/remove_collaborator/`, { user_id: userId })
    return response.data
  },
}