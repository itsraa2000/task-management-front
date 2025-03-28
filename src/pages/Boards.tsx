import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { useToast } from "../hooks/use-toast"
import { boardsApi, type Board } from "../api/boards"
import { tasksApi, type Task, type CreateTaskData } from "../api/tasks"
import { authApi } from "../api/auth"
import { PlusCircle, MoreHorizontal, Users, UserPlus, ArrowLeft } from "lucide-react"
import { useAuth } from "../contexts/useAuth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"

// Import components
import TaskForm from "../components/task-form"
import InviteUserForm from "../components/boards/invite-user-form"

export default function BoardsPage() {
  const { boardId } = useParams<{ boardId: string }>()
  const [board, setBoard] = useState<Board | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [isInviteFormOpen, setIsInviteFormOpen] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (!boardId) {
      navigate("/board-selection")
      return
    }

    const fetchBoardData = async () => {
      try {
        setLoading(true)
        const [boardData, tasksData] = await Promise.all([
          boardsApi.getBoard(Number.parseInt(boardId)),
          tasksApi.getTasks(),
        ])
        setBoard(boardData)

        // Filter tasks that belong to this board
        // Note: This is a simplified approach. In a real app, you might want to
        // fetch tasks specifically for this board from the API
        setTasks(tasksData)
      } catch (error) {
        console.error("Error fetching board data:", error)
        toast({
          title: "Error",
          description: "Failed to load board data. Please try again.",
          type: "error",
        })
        navigate("/board-selection")
      } finally {
        setLoading(false)
      }
    }

    fetchBoardData()
  }, [boardId, navigate, toast])

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result

    if (source.droppableId === destination.droppableId) {
      // Reordering within the same column
      return
    }

    // Update task status
    try {
      const taskId = Number.parseInt(draggableId)
      const newStatus = destination.droppableId as "todo" | "in-progress" | "done"

      // Optimistically update UI
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task,
        ),
      )

      // Update in backend
      await tasksApi.updateTask(taskId, { status: newStatus })

      toast({
        title: "Task updated",
        description: "Task status has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating task status:", error)
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        type: "error",
      })

      // Revert optimistic update on failure
      // You would need to refetch tasks here
    }
  }

  const handleCreateTask = async (taskData: CreateTaskData) => {
    try {
      const newTask = await tasksApi.createTask({
        ...taskData,
        status: "todo",
      })

      // Add task to board
      if (board) {
        await boardsApi.addTask(board.id, newTask.id)
      }

      // Update tasks list
      setTasks((prev) => [...prev, newTask])

      setIsTaskFormOpen(false)
      toast({
        title: "Task created",
        description: "New task has been created successfully.",
      })
    } catch (error) {
      console.error("Error creating task:", error)
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        type: "error",
      })
    }
  }

  const handleInviteUser = async (data: { email: string; role: "admin" | "member" }) => {
    try {
      if (!board) return

      // First search for the user by email
      const users = await authApi.searchUsers(data.email)
      if (users.length === 0) {
        toast({
          title: "User not found",
          description: `No user found with email ${data.email}`,
          type: "error",
        })
        return
      }

      const userToInvite = users[0]

      // Check if user is already a member
      const isMember = board.members.some((member) => member.user.id === userToInvite.id)
      if (isMember) {
        toast({
          title: "Already a member",
          description: `${userToInvite.username} is already a member of this board`,
          type: "error",
        })
        return
      }

      // Add user to board
      await boardsApi.addMember(board.id, userToInvite.id, data.role)

      // Refresh board data to show new member
      const updatedBoard = await boardsApi.getBoard(board.id)
      setBoard(updatedBoard)

      setIsInviteFormOpen(false)
      toast({
        title: "User invited",
        description: `${userToInvite.username} has been added to the board`,
      })
    } catch (error) {
      console.error("Error inviting user:", error)
      toast({
        title: "Error",
        description: "Failed to invite user. Please try again.",
        type: "error",
      })
    }
  }

  const isOwner = board?.owner.id === user?.id
  const isAdmin = board?.members.some(
    (member) => member.user.id === user?.id && (member.role === "admin" || member.role === "owner"),
  )

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading board...</div>
  }

  if (!board) {
    return <div className="flex items-center justify-center h-screen">Board not found</div>
  }

  const todoTasks = tasks.filter((task) => task.status === "todo")
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress")
  const doneTasks = tasks.filter((task) => task.status === "done")

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <Button
            variant="ghost"
            className="mb-2 -ml-3 flex items-center text-gray-500 hover:text-gray-700"
            onClick={() => navigate("/board-selection")}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Boards
          </Button>
          <h1 className="text-3xl font-bold">{board.name}</h1>
          <div className="flex items-center mt-2 text-gray-500">
            <Users className="h-4 w-4 mr-1" />
            <span>{board.members.length} members</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Dialog open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <TaskForm onSubmit={handleCreateTask} onCancel={() => setIsTaskFormOpen(false)} />
            </DialogContent>
          </Dialog>

          {(isOwner || isAdmin) && (
            <Dialog open={isInviteFormOpen} onOpenChange={setIsInviteFormOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Invite User to Board</DialogTitle>
                </DialogHeader>
                <InviteUserForm onSubmit={handleInviteUser} onCancel={() => setIsInviteFormOpen(false)} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Board Members */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Board Members</h2>
        <div className="flex flex-wrap gap-2">
          {board.members.map((member) => (
            <div
              key={member.id}
              className="flex items-center bg-gray-100 rounded-full px-3 py-1"
              title={`${member.user.username} (${member.role})`}
            >
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-medium text-white mr-2">
                {member.user.first_name?.[0] || member.user.username[0]}
                {member.user.last_name?.[0] || ""}
              </div>
              <span className="text-sm">{member.user.username}</span>
              <span className="text-xs text-gray-500 ml-1">({member.role})</span>
            </div>
          ))}
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* To Do Column */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">To Do</h2>
            <Droppable droppableId="todo">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4 min-h-[200px]">
                  {todoTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <TaskCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {todoTasks.length === 0 && (
                    <div className="p-4 text-center text-gray-500 bg-gray-100 rounded-lg">No tasks to do</div>
                  )}
                </div>
              )}
            </Droppable>
          </div>

          {/* In Progress Column */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">In Progress</h2>
            <Droppable droppableId="in-progress">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4 min-h-[200px]">
                  {inProgressTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <TaskCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {inProgressTasks.length === 0 && (
                    <div className="p-4 text-center text-gray-500 bg-gray-100 rounded-lg">No tasks in progress</div>
                  )}
                </div>
              )}
            </Droppable>
          </div>

          {/* Done Column */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Done</h2>
            <Droppable droppableId="done">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4 min-h-[200px]">
                  {doneTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <TaskCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {doneTasks.length === 0 && (
                    <div className="p-4 text-center text-gray-500 bg-gray-100 rounded-lg">No completed tasks</div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
    </div>
  )
}

// Task Card Component
function TaskCard({ task }: { task: Task }) {
  const priorityColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  }

  const handleViewTask = () => {
    // Implement task details view
    console.log("View task:", task.id)
  }

  const handleEditTask = () => {
    // Implement task edit
    console.log("Edit task:", task.id)
  }

  const handleDeleteTask = () => {
    // Implement task delete
    console.log("Delete task:", task.id)
  }

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-medium">{task.title}</CardTitle>
          <div className="flex items-center gap-2">
            <div className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[task.priority]}`}>
              {task.priority}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleViewTask}>View Details</DropdownMenuItem>
                <DropdownMenuItem onClick={handleEditTask}>Edit Task</DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteTask} className="text-red-600">
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        {task.description && <p className="text-sm text-gray-600 line-clamp-2 mb-2">{task.description}</p>}
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-medium text-white">
              {task.owner.first_name[0]}
              {task.owner.last_name[0]}
            </div>
            {task.collaborators.length > 0 && (
              <div className="ml-1 text-xs text-gray-500">+{task.collaborators.length}</div>
            )}
          </div>
          {task.end_date && (
            <div className="text-xs text-gray-500">Due: {new Date(task.end_date).toLocaleDateString()}</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}