import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TaskList from "../components/task-list";
import TaskForm from "../components/task-form";
import TaskFilters from "../components/task-filter";
import { Button } from "../components/ui/button";
import { Plus, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Users, ArrowLeft } from "lucide-react";
import type { Priority, Status } from "../lib/types";
import { tasksApi, type Task, type CreateTaskData } from "../api/tasks";
import { useToast } from "../hooks/use-toast";
import InviteUserForm from "../components/boards/invite-user-form";
import { authApi } from "../api/auth";
import { boardsApi, type Board } from "../api/boards";
import { useAuth } from "../contexts/useAuth";

export default function TaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isInviteFormOpen, setIsInviteFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();
  const { boardId } = useParams<{ boardId: string }>();
  const [board, setBoard] = useState<Board | null>(null);

  const [dataFetched, setDataFetched] = useState(false);

  const { user } = useAuth();

  const showToast = useCallback(
    (
      title: string,
      description: string,
      type: "success" | "error" | "info" | "loading" = "success"
    ) => {
      toast({
        title,
        description,
        type,
      });
    },
    [toast]
  );

  const fetchBoardData = useCallback(async () => {
    if (!boardId || dataFetched) {
      return;
    }

    try {
      setLoading(true);
      const boardData = await boardsApi.getBoard(Number.parseInt(boardId));
      if (!boardData) {
        throw new Error("Board not found");
      }

      console.log("Fetched board data:", boardData);
      setBoard(boardData);

      // Fetch the tasks for this board
      const tasksData = await tasksApi.getTasksByBoard(
        Number.parseInt(boardId)
      );
      console.log("Fetched tasks data:", tasksData);
      setTasks(tasksData);

      setDataFetched(true);
    } catch (error) {
      console.error("Error fetching board data:", error);
      showToast("Error", "Something went wrong. Please try again.");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  }, [boardId, dataFetched, navigate, showToast]);

  useEffect(() => {
    fetchBoardData();
  }, [fetchBoardData]);

  useEffect(() => {
    let filtered = [...tasks];

    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((task) => task.priority === priorityFilter);
    }

    setFilteredTasks(filtered);
  }, [tasks, statusFilter, priorityFilter]);

  const handleCreateTask = async (taskData: CreateTaskData) => {
    if (!board) {
      showToast("Error", "Board not found. Please try again.", "error");
      return;
    }
    try {
      await tasksApi.createTask({
        ...taskData,
        board_id: board?.id,
        description: taskData.description ?? undefined,
      });

      setIsFormOpen(false);
      showToast("Success", "Task created successfully");

      setDataFetched(false);
      fetchBoardData();
    } catch (error) {
      console.error("Error creating task:", error);
      showToast("Error", "Failed to create task. Please try again.", "error");
    }
  };

  const handleUpdateTask = async (
    taskData: CreateTaskData & { id: number }
  ) => {
    if (!board) {
      showToast("Error", "Board not found. Please try again.", "error");
      return;
    }

    try {
      const updatedTask = await tasksApi.updateTask(taskData.id, {
        ...taskData,
        board_id: board.id,
        title: taskData.title,
        description: taskData.description ?? undefined,
      });

      setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
      showToast("Success", "Task updated successfully");
    } catch (error) {
      console.error("Error updating task:", error);
      showToast("Error", "Failed to update task. Please try again.", "error");
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await tasksApi.deleteTask(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
      showToast("Success", "Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      showToast("Error", "Failed to delete task. Please try again.", "error");
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleStatusChange = async (
    task: Task,
    newStatus: "todo" | "in-progress" | "done"
  ) => {
    try {
      const updatedTask = await tasksApi.updateTask(task.id, {
        status: newStatus,
      });
      setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
      showToast("Success", "Task status updated successfully");
    } catch (error) {
      console.error("Error updating task status:", error);
      showToast(
        "Error",
        "Failed to update task status. Please try again.",
        "error"
      );
    }
  };

  const handleInviteUser = async (data: {
    email: string;
    role: "admin" | "member";
    taskId?: number;
  }) => {
    try {
      if (!board) {
        toast({
          title: "Error",
          description: "Board data is not available. Please try again later.",
          type: "error",
        });
        return;
      }

      const users = await authApi.searchUsers(data.email);
      if (users.length === 0) {
        toast({
          title: "User not found",
          description: `No user found with email ${data.email}`,
          type: "error",
        });
        return;
      }

      const userToInvite = users[0];

      if (data.taskId) {
        await tasksApi.addCollaborator(data.taskId, userToInvite.id);
        toast({
          title: "Collaborator Added",
          description: `${userToInvite.username} has been added to the task.`,
        });
      } else {
        await boardsApi.inviteUser(board.id, userToInvite.email, data.role);
        toast({
          title: "Invitation Sent",
          description: `${userToInvite.username} has been invited to the board.`,
        });
      }

      setIsInviteFormOpen(false);
    } catch (error) {
      console.error("Error inviting user:", error);
      toast({
        title: "Error",
        description: "Failed to invite user. Please try again.",
        type: "error",
      });
    }
  };

  const handleDeleteBoard = async () => {
    if (!board) {
      showToast("Error", "Board not found. Please try again.", "error");
      return;
    }

    if (board.owner.id !== user?.id) {
      showToast(
        "Error",
        "You don't have permission to delete this board.",
        "error"
      );
      return;
    }

    try {
      await boardsApi.deleteBoard(board.id);
      showToast("Success", "Board deleted successfully.");
      navigate("/dashboard"); // Redirect after deletion
    } catch (error) {
      console.error("Error deleting board:", error);
      showToast("Error", "Failed to delete board. Please try again.", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading tasks...
      </div>
    );
  }

  const isOwner = board?.owner.id === user?.id;
  const isAdmin =
    board?.members?.some(
      (member) =>
        member.user.id === user?.id && ["admin", "owner"].includes(member.role)
    ) ?? false;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <Button
            variant="ghost"
            className="mb-2 -ml-3 flex items-center text-gray-500 hover:text-gray-700"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Boards
          </Button>
          <h1 className="text-3xl font-bold">{board?.name}</h1>
          <div className="flex items-center mt-2 text-gray-500">
            <Users className="h-4 w-4 mr-1" />
            <span>{board?.members_count} members</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingTask ? "Edit Task" : "Create New Task"}
                </DialogTitle>
              </DialogHeader>
              <TaskForm
                onSubmit={(data: CreateTaskData | Task) =>
                  editingTask
                    ? handleUpdateTask({
                        ...data,
                        description: data.description || undefined,
                      } as CreateTaskData & { id: number })
                    : handleCreateTask(data as CreateTaskData)
                }
                onCancel={() => {
                  setIsFormOpen(false);
                  setEditingTask(null);
                }}
                initialData={editingTask}
              />
            </DialogContent>
          </Dialog>
          {(isOwner || isAdmin) && (
            <>
              <Dialog
                open={isInviteFormOpen}
                onOpenChange={setIsInviteFormOpen}
              >
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
                  <InviteUserForm
                    onSubmit={handleInviteUser}
                    onCancel={() => setIsInviteFormOpen(false)}
                  />
                </DialogContent>
              </Dialog>
              {isOwner && (
                <Button variant="destructive" onClick={handleDeleteBoard}>
                  Delete Board
                </Button>
              )}
            </>
          )}

          <Dialog
            open={!!editingTask}
            onOpenChange={(open) => !open && setEditingTask(null)}
          >
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Edit Task</DialogTitle>
              </DialogHeader>
              {editingTask && (
                <TaskForm
                  initialData={editingTask}
                  onSubmit={(updatedTask) => {
                    setTasks((prevTasks) =>
                      prevTasks.map((task) =>
                        task.id === updatedTask.id ? updatedTask : task
                      )
                    );
                    setEditingTask(null); // Close dialog after update
                  }}
                  onCancel={() => setEditingTask(null)}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <TaskFilters
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        onStatusFilterChange={setStatusFilter}
        onPriorityFilterChange={setPriorityFilter}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <TaskList
          title="To Do"
          tasks={filteredTasks.filter((task) => task.status === "todo")}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onStatusChange={(task) => handleStatusChange(task, "in-progress")}
          nextStatusLabel="Move to In Progress"
        />
        <TaskList
          title="In Progress"
          tasks={filteredTasks.filter((task) => task.status === "in-progress")}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onStatusChange={(task) => handleStatusChange(task, "done")}
          nextStatusLabel="Move to Done"
        />
        <TaskList
          title="Done"
          tasks={filteredTasks.filter((task) => task.status === "done")}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onStatusChange={(task) => handleStatusChange(task, "todo")}
          nextStatusLabel="Move to To Do"
        />
      </div>
    </div>
  );
}
