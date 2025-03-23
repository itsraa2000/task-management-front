export type Priority = "low" | "medium" | "high"
export type Status = "todo" | "in-progress" | "done"

export interface Task {
  id: string
  title: string
  description?: string
  priority: Priority
  status: Status
  startDate?: string
  endDate?: string
  collaborators?: User[]
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role?: "owner" | "admin" | "member"
}

export interface Collaboration {
  id: string
  name: string
  members: User[]
  taskCount: number
}

