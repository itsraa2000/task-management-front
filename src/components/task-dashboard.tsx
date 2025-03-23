"use client"

import { useState, useEffect } from "react"
import TaskList from "./task-list"
import TaskForm from "./task-form"
import TaskFilters from "./task-filter"
import { Button } from "../components/ui/button"
import { Plus } from "lucide-react"
import type { Task, Priority, Status } from "../lib/types"
import { mockTasks } from "../lib/mock-data"

export default function TaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all")
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all")

  // In a real app, this would fetch from the API
  useEffect(() => {
    setTasks(mockTasks)
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = [...tasks]

    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((task) => task.priority === priorityFilter)
    }

    setFilteredTasks(filtered)
  }, [tasks, statusFilter, priorityFilter])

  const handleCreateTask = (task: Task) => {
    // In a real app, this would call the API
    const newTask = {
      ...task,
      id: Date.now().toString(),
    }
    setTasks([...tasks, newTask])
    setIsFormOpen(false)
  }

  const handleUpdateTask = (updatedTask: Task) => {
    // In a real app, this would call the API
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    setEditingTask(null)
    setIsFormOpen(false)
  }

  const handleDeleteTask = (taskId: string) => {
    // In a real app, this would call the API
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Task Dashboard</h1>
        <Button
          onClick={() => {
            setEditingTask(null)
            setIsFormOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      <TaskFilters
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        onStatusFilterChange={setStatusFilter}
        onPriorityFilterChange={setPriorityFilter}
      />

      {isFormOpen && (
        <div className="mb-8">
          <TaskForm
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={() => {
              setIsFormOpen(false)
              setEditingTask(null)
            }}
            initialData={editingTask}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TaskList
          title="To Do"
          tasks={filteredTasks.filter((task) => task.status === "todo")}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onStatusChange={handleUpdateTask}
        />
        <TaskList
          title="In Progress"
          tasks={filteredTasks.filter((task) => task.status === "in-progress")}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onStatusChange={handleUpdateTask}
        />
        <TaskList
          title="Done"
          tasks={filteredTasks.filter((task) => task.status === "done")}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onStatusChange={handleUpdateTask}
        />
      </div>
    </div>
  )
}

