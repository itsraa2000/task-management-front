import api from "./axios"
import type { UserProfile } from "./auth"

export interface BoardMember {
  id: number
  user: UserProfile
  role: "owner" | "admin" | "member"
  joined_at: string
}

export interface Board {
  id: number
  name: string
  created_at: string
  owner: UserProfile
  members: BoardMember[]
  task_count: number
  members_count: number
}

export interface CreateBoardData {
  name: string
}

export const boardsApi = {
  getBoards: async () => {
    const response = await api.get<Board[]>("/boards/")
    return response.data
  },

  getBoard: async (id: number) => {
    const response = await api.get<Board>(`/boards/${id}/`)
    return response.data
  },

  createBoard: async (data: CreateBoardData) => {
    const response = await api.post<Board>("/boards/", data)
    return response.data
  },

  updateBoard: async (id: number, data: Partial<CreateBoardData>) => {
    const response = await api.put<Board>(`/boards/${id}/`, data)
    return response.data
  },

  deleteBoard: async (id: number) => {
    await api.delete(`/boards/${id}/`)
  },

  addMember: async (boardId: number, userId: number, role: "admin" | "member" = "member") => {
    const response = await api.post(`/boards/${boardId}/add_member/`, {
      user_id: userId,
      role,
    })
    return response.data
  },

  removeMember: async (boardId: number, userId: number) => {
    const response = await api.post(`/boards/${boardId}/remove_member/`, { user_id: userId })
    return response.data
  },

  addTask: async (boardId: number, taskId: number) => {
    const response = await api.post(`/boards/${boardId}/add_task/`, { task_id: taskId })
    return response.data
  },

  removeTask: async (boardId: number, taskId: number) => {
    const response = await api.post(`/boards/${boardId}/remove_task/`, { task_id: taskId })
    return response.data
  },

  inviteUser: async (boardId: number, email: string, role: "admin" | "member") => {
    const response = await api.post(`/invitations/invite/`, {
      board_id: boardId,
      invitee_email: email,
      role,
    });
    return response.data;
  },
}