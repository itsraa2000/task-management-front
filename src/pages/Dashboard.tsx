import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/useAuth";
import { tasksApi, type Task } from "../api/tasks";
import { boardsApi, type Board } from "../api/boards";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  ListTodo,
  Layout,
  Users,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import BoardForm from "../components/boards/board-form";
import { PlusCircle } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [isBoardFormOpen, setIsBoardFormOpen] = useState(false);

  const handleCreateBoard = async (data: { name: string }) => {
    try {
      const newBoard = await boardsApi.createBoard(data);
      setBoards((prev) => [...prev, newBoard]);
      setIsBoardFormOpen(false);
      navigate(`/boards/${newBoard.id}`);
    } catch (error) {
      console.error("Error creating board:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tasksData, boardsData] = await Promise.all([
          tasksApi.getTasks(),
          boardsApi.getBoards(),
        ]);
        setTasks(tasksData);
        setBoards(boardsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const todoTasks = tasks.filter((task) => task.status === "todo");
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress");
  const completedTasks = tasks.filter((task) => task.status === "done");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome, {user?.first_name || "User"}!
        </h1>
        <p className="text-gray-600">
          Here's an overview of your tasks and boards
        </p>
      </div>

      {/* Task Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <ListTodo className="mr-2 h-5 w-5 text-blue-500" />
              To Do
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{todoTasks.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-yellow-500" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{inProgressTasks.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{completedTasks.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tasks */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Recent Tasks</h2>
        </div>

        {tasks.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No tasks found</h3>
                <p className="text-gray-500 mb-4">
                  You don't have any tasks yet.
                </p>
                <Button onClick={() => navigate("/board-selection")}>
                  Go to Board Selection
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.slice(0, 3).map((task) => (
              <Card
                key={task.id}
                className="cursor-pointer hover:shadow-md transition-shadow shadow-amber-50/20"
                onClick={() => navigate(`/boards/${task.board_id}`)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <div
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        task.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : task.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {task.priority}
                    </div>
                  </div>
                  <CardDescription>
                    {task.status === "todo"
                      ? "To Do"
                      : task.status === "in-progress"
                      ? "In Progress"
                      : "Done"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 line-clamp-2">
                    {task.description || "No description"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Your Boards */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Your Boards</h2>
          <Dialog open={isBoardFormOpen} onOpenChange={setIsBoardFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Board
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Board</DialogTitle>
              </DialogHeader>
              <BoardForm
                onSubmit={handleCreateBoard}
                onCancel={() => setIsBoardFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {boards.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <Layout className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No boards found</h3>
                <p className="text-gray-500 mb-4">
                  You don't have any boards yet.
                </p>
                <Button onClick={() => navigate("/board-selection")}>
                  Create a Board
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boards.slice(0, 3).map((board) => (
              <Card
                key={board.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <CardTitle>{board.name}</CardTitle>
                  <CardDescription>
                    Created {new Date(board.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="mr-2 h-4 w-4" />
                    <span>{board?.members?.length || 0} members</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => navigate(`/boards/${board.id}`)}
                  >
                    Open Board
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
