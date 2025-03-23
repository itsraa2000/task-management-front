"use client"

import { useState } from "react"
import { format } from "date-fns"
import type { Task } from "../lib/types"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { Edit, Trash2, MoreVertical, ArrowRight, ArrowLeft, Users } from "lucide-react"

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onStatusChange: (task: Task) => void
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  const handleMoveForward = () => {
    let newStatus = task.status
    if (task.status === "todo") {
      newStatus = "in-progress"
    } else if (task.status === "in-progress") {
      newStatus = "done"
    }

    if (newStatus !== task.status) {
      onStatusChange({ ...task, status: newStatus })
    }
  }

  const handleMoveBackward = () => {
    let newStatus = task.status
    if (task.status === "done") {
      newStatus = "in-progress"
    } else if (task.status === "in-progress") {
      newStatus = "todo"
    }

    if (newStatus !== task.status) {
      onStatusChange({ ...task, status: newStatus })
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-medium text-lg mb-1">{task.title}</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
              {task.collaborators && task.collaborators.length > 0 && (
                <Badge variant="outline" className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  {task.collaborators.length}
                </Badge>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div
          className={`mt-2 text-sm text-muted-foreground ${isExpanded ? "" : "line-clamp-2"}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {task.description}
        </div>

        <div className="mt-3 text-xs text-muted-foreground">
          {task.startDate && task.endDate && (
            <div className="flex justify-between">
              <span>Start: {format(new Date(task.startDate), "MMM d, yyyy")}</span>
              <span>Due: {format(new Date(task.endDate), "MMM d, yyyy")}</span>
            </div>
          )}
        </div>

        <div className="mt-3 flex justify-between">
          {task.status !== "todo" && (
            <Button variant="outline" size="sm" onClick={handleMoveBackward} className="h-8">
              <ArrowLeft className="h-4 w-4 mr-1" /> Move Back
            </Button>
          )}
          {task.status === "todo" && <div></div>}

          {task.status !== "done" && (
            <Button variant="outline" size="sm" onClick={handleMoveForward} className="h-8 ml-auto">
              Move Forward <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

