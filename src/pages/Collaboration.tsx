import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { mockCollaborations } from "../lib/mock-data";
import type { Collaboration } from "../lib/types";

const CollaborationsPage: React.FC = () => {
  const [collaborations, setCollaborations] = useState<Collaboration[]>(mockCollaborations);
  const [inviteEmail, setInviteEmail] = useState<string>("");
  const [boardName, setBoardName] = useState<string>("");
  const [showNewBoardForm, setShowNewBoardForm] = useState<boolean>(false);

  const handleCreateBoard = (): void => {
    if (!boardName.trim()) return;

    const newBoard: Collaboration = {
      id: Date.now().toString(),
      name: boardName,
      members: [
        {
          id: "current-user",
          name: "You",
          email: "you@example.com",
          role: "owner",
          avatar: "/placeholder.svg?height=40&width=40",
        },
      ],
      taskCount: 0,
    };

    setCollaborations([...collaborations, newBoard]);
    setBoardName("");
    setShowNewBoardForm(false);
  };

  const handleInvite = (boardId: string): void => {
    if (!inviteEmail.trim()) return;

    setCollaborations(
      collaborations.map((board) =>
        board.id === boardId
          ? {
              ...board,
              members: [
                ...board.members,
                {
                  id: Date.now().toString(),
                  name: inviteEmail.split("@")[0],
                  email: inviteEmail,
                  role: "member",
                  avatar: "/placeholder.svg?height=40&width=40",
                },
              ],
            }
          : board
      )
    );

    setInviteEmail("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Collaborations</h1>
        <Button onClick={() => setShowNewBoardForm(true)}>Create New Board</Button>
      </div>

      {showNewBoardForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New Board</CardTitle>
            <CardDescription>Create a new board to collaborate with others</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="board-name" className="text-sm font-medium">
                  Board Name
                </label>
                <Input
                  id="board-name"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  placeholder="Enter board name"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowNewBoardForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateBoard}>Create Board</Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collaborations.map((board) => (
          <Card key={board.id}>
            <CardHeader>
              <CardTitle>{board.name}</CardTitle>
              <CardDescription>
                {board.taskCount} tasks · {board.members.length} members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex -space-x-2">
                  {board.members.slice(0, 5).map((member) => (
                    <Avatar key={member.id} className="border-2 border-background">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                  {board.members.length > 5 && (
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted text-sm font-medium">
                      +{board.members.length - 5}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Members</h3>
                  <div className="space-y-2">
                    {board.members.slice(0, 3).map((member) => (
                      <div key={member.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{member.name}</span>
                        </div>
                        <Badge variant="outline">{member.role}</Badge>
                      </div>
                    ))}
                    {board.members.length > 3 && (
                      <Button variant="link" className="text-xs p-0 h-auto">
                        View all members
                      </Button>
                    )}
                  </div>
                </div>
                <div className="pt-2">
                  <h3 className="text-sm font-medium mb-2">Invite Member</h3>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Email address"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                    <Button size="sm" onClick={() => handleInvite(board.id)}>
                      Invite
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <a href={`/board/${board.id}`}>Open Board</a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CollaborationsPage;