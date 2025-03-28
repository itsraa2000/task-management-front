import type { Task, Collaboration } from "./types"

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Design User Interface",
    description: "Create wireframes and mockups for the new dashboard",
    priority: "high",
    status: "todo",
    startDate: "2025-03-20",
    endDate: "2025-03-25",
    collaborators: [
      { id: "1", name: "John Doe", email: "john@example.com" },
      { id: "2", name: "Jane Smith", email: "jane@example.com" },
    ],
  },
  {
    id: "2",
    title: "Implement Authentication",
    description: "Set up JWT authentication for the API",
    priority: "high",
    status: "in-progress",
    startDate: "2025-03-18",
    endDate: "2025-03-22",
  },
  {
    id: "3",
    title: "Database Schema Design",
    description: "Design the PostgreSQL database schema for the application",
    priority: "medium",
    status: "done",
    startDate: "2025-03-15",
    endDate: "2025-03-18",
  },
  {
    id: "4",
    title: "API Documentation",
    description: "Write documentation for the REST API endpoints",
    priority: "low",
    status: "todo",
    startDate: "2025-03-25",
    endDate: "2025-03-28",
  },
  {
    id: "5",
    title: "Unit Testing",
    description: "Write unit tests for the backend services",
    priority: "medium",
    status: "todo",
    startDate: "2025-03-22",
    endDate: "2025-03-26",
  },
  {
    id: "6",
    title: "Deploy to Staging",
    description: "Deploy the application to the staging environment",
    priority: "medium",
    status: "in-progress",
    startDate: "2025-03-20",
    endDate: "2025-03-21",
  },
  {
    id: "7",
    title: "Performance Optimization",
    description: "Optimize database queries and frontend rendering",
    priority: "low",
    status: "todo",
    startDate: "2025-03-26",
    endDate: "2025-03-30",
  },
  {
    id: "8",
    title: "User Feedback Collection",
    description: "Create a form to collect user feedback on the beta version",
    priority: "low",
    status: "done",
    startDate: "2025-03-10",
    endDate: "2025-03-15",
  },
]

export const mockCollaborations: Collaboration[] = [
  {
    id: "1",
    name: "Marketing Campaign",
    members: [
      { id: "1", name: "You", email: "you@example.com", role: "owner", avatar: "/placeholder.svg?height=40&width=40" },
      {
        id: "2",
        name: "John Doe",
        email: "john@example.com",
        role: "admin",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "3",
        name: "Jane Smith",
        email: "jane@example.com",
        role: "member",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
    taskCount: 12,
  },
  {
    id: "2",
    name: "Product Development",
    members: [
      { id: "1", name: "You", email: "you@example.com", role: "admin", avatar: "/placeholder.svg?height=40&width=40" },
      {
        id: "4",
        name: "Mike Johnson",
        email: "mike@example.com",
        role: "owner",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "5",
        name: "Sarah Williams",
        email: "sarah@example.com",
        role: "member",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "6",
        name: "David Brown",
        email: "david@example.com",
        role: "member",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
    taskCount: 8,
  },
  {
    id: "3",
    name: "Website Redesign",
    members: [
      { id: "1", name: "You", email: "you@example.com", role: "member", avatar: "/placeholder.svg?height=40&width=40" },
      {
        id: "7",
        name: "Emily Davis",
        email: "emily@example.com",
        role: "owner",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "8",
        name: "Alex Wilson",
        email: "alex@example.com",
        role: "admin",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "9",
        name: "Lisa Taylor",
        email: "lisa@example.com",
        role: "member",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "10",
        name: "Ryan Miller",
        email: "ryan@example.com",
        role: "member",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "11",
        name: "Olivia Jones",
        email: "olivia@example.com",
        role: "member",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
    taskCount: 15,
  },
]

