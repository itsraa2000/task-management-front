import { useState } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import type { Task } from "../api/tasks"
import { tasksApi } from "../api/tasks"
import { boardsApi, type Board } from "../api/boards"
import { useEffect } from "react"
import { Skeleton } from "../components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [tasks, setTasks] = useState<Task[]>([])
  const [boards, setBoards] = useState<Board[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [tasksData, boardsData] = await Promise.all([tasksApi.getTasks(), boardsApi.getBoards()])
        setTasks(tasksData)
        setBoards(boardsData)
      } catch (error) {
        console.error("Error fetching calendar data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  const getTasksForDay = (day: Date) => {
    return tasks.filter((task) => {
      if (!task.start_date) return false
      const taskDate = new Date(task.start_date)
      return isSameDay(taskDate, day)
    })
  }

  const getBoardNameForTask = (task: Task): string => {
    // In the API, we don't have direct access to which board a task belongs to
    // We need to use the board's task_count or another approach

    // Since we don't have a direct relationship in the Board type,
    // we'll need to check if the task is associated with a board through the board's API
    // This is a workaround until we have a proper relationship

    // For now, we'll use the task's owner to try to match with a board's owner
    const possibleBoards = boards.filter((board) => board.owner.id === task.owner.id)

    if (possibleBoards.length === 1) {
      return possibleBoards[0].name
    } else if (possibleBoards.length > 1) {
      // If there are multiple boards by the same owner, we'll just return the first one
      // In a real app, you would want to store the boardId on the task
      return possibleBoards[0].name + " (Likely)"
    }

    return "Unknown Board"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Task Calendar</h1>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <Skeleton className="h-8 w-40" />
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center font-medium py-2">
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }).map((_, index) => (
                <Skeleton key={index} className="h-24 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Task Calendar</h1>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5" />
            {format(currentDate, "MMMM yyyy")}
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-medium py-2">
                {day}
              </div>
            ))}

            {Array.from({ length: monthStart.getDay() }).map((_, index) => (
              <div key={`empty-start-${index}`} className="h-28 border rounded-md bg-muted/20"></div>
            ))}

            {monthDays.map((day) => {
              const dayTasks = getTasksForDay(day)
              return (
                <div
                  key={day.toString()}
                  className={`h-28 border rounded-md p-1 overflow-hidden ${
                    isToday(day)
                      ? "bg-blue-50 border-blue-200"
                      : isSameMonth(day, currentDate)
                        ? "bg-card"
                        : "bg-muted/20"
                  }`}
                >
                  <div className="text-right mb-1">
                    <span
                      className={`text-sm font-medium ${isToday(day) ? "bg-primary text-primary-foreground rounded-full px-1.5 py-0.5" : ""}`}
                    >
                      {format(day, "d")}
                    </span>
                  </div>
                  <div className="space-y-1 overflow-y-auto max-h-[calc(100%-20px)]">
                    <TooltipProvider>
                      {dayTasks.map((task) => (
                        <Tooltip key={task.id}>
                          <TooltipTrigger asChild>
                            <div className="text-xs p-1 rounded truncate flex flex-col bg-gray-50 hover:bg-gray-100 cursor-pointer border border-gray-200">
                              <div className="flex items-center">
                                <span className={`w-2 h-2 rounded-full mr-1 ${getPriorityColor(task.priority)}`}></span>
                                <span className="font-medium truncate">{task.title}</span>
                              </div>
                              <div className="flex justify-between text-[10px] text-gray-500 mt-0.5">
                                <span className="truncate max-w-[60%]">{getBoardNameForTask(task)}</span>
                                {task.end_date && <span>Due: {format(new Date(task.end_date), "MM/dd")}</span>}
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-xs">
                            <div>
                              <p className="font-bold">{task.title}</p>
                              <p className="text-xs mt-1">{task.description || "No description"}</p>
                              <div className="mt-2 text-xs">
                                <p>
                                  <span className="font-semibold">Board:</span> {getBoardNameForTask(task)}
                                </p>
                                <p>
                                  <span className="font-semibold">Priority:</span> {task.priority}
                                </p>
                                {task.start_date && (
                                  <p>
                                    <span className="font-semibold">Start:</span>{" "}
                                    {format(new Date(task.start_date), "MMM dd, yyyy")}
                                  </p>
                                )}
                                {task.end_date && (
                                  <p>
                                    <span className="font-semibold">Due:</span>{" "}
                                    {format(new Date(task.end_date), "MMM dd, yyyy")}
                                  </p>
                                )}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </TooltipProvider>
                  </div>
                </div>
              )
            })}

            {Array.from({ length: 6 - monthEnd.getDay() }).map((_, index) => (
              <div key={`empty-end-${index}`} className="h-28 border rounded-md bg-muted/20"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

