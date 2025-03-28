import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Skeleton } from "../components/ui/skeleton"
import { PlusCircle, Users, Calendar, Search } from "lucide-react"
import { boardsApi, type Board } from "../api/boards"
import { useToast } from "../hooks/use-toast"
import { Input } from "../components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import BoardForm from "../components/boards/board-form"

export default function BoardSelectionPage() {
  const [boards, setBoards] = useState<Board[]>([])
  const [filteredBoards, setFilteredBoards] = useState<Board[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isBoardFormOpen, setIsBoardFormOpen] = useState(false)
  const navigate = useNavigate()
  const toast  = useToast()

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        setLoading(true)
        const boardsData = await boardsApi.getBoards()
        setBoards(boardsData)
        setFilteredBoards(boardsData)
      } catch (error) {
        console.error("Error fetching boards:", error)
        toast({
          title: "Error",
          description: "Failed to load boards. Please try again.",
          type: "error",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBoards()
  }, [toast])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBoards(boards)
    } else {
      const filtered = boards.filter((board) => board.name.toLowerCase().includes(searchQuery.toLowerCase()))
      setFilteredBoards(filtered)
    }
  }, [searchQuery, boards])

  const handleBoardSelect = (boardId: number) => {
    navigate(`/boards/${boardId}`)
  }

  const handleCreateBoard = async (data: { name: string }) => {
    try {
      const newBoard = await boardsApi.createBoard(data)
      setBoards((prev) => [...prev, newBoard])
      setFilteredBoards((prev) => [...prev, newBoard])
      setIsBoardFormOpen(false)
      toast({
        title: "Success",
        description: "Board created successfully!",
      })
      // Navigate to the new board
      navigate(`/boards/${newBoard.id}`)
    } catch (error) {
      console.error("Error creating board:", error)
      toast({
        title: "Error",
        description: "Failed to create board. Please try again.",
        type: "error",
      })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Boards</h1>
          <p className="text-gray-500 mt-1">Select a board to manage tasks or create a new one</p>
        </div>
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
            <BoardForm onSubmit={handleCreateBoard} onCancel={() => setIsBoardFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search boards..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredBoards.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          {searchQuery ? (
            <>
              <h2 className="text-xl font-semibold mb-2">No boards found matching "{searchQuery}"</h2>
              <p className="text-gray-500 mb-6">Try a different search term or create a new board</p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-2">No boards found</h2>
              <p className="text-gray-500 mb-6">Create your first board to get started</p>
            </>
          )}
          <Button onClick={() => setIsBoardFormOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Board
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBoards.map((board) => (
            <Card key={board.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle>{board.name}</CardTitle>
                <CardDescription>Created {new Date(board.created_at).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Users className="mr-2 h-4 w-4" />
                  <span>{board.members.length} members</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{board.task_count} tasks</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleBoardSelect(board.id)}>
                  Open Board
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}