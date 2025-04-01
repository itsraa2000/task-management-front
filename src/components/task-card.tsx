import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import type { Task } from "../api/tasks";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Edit, Trash2, MoreVertical, ArrowRight, Users } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onStatusChange: (task: Task) => void;
}

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const handleMoveForward = () => {
    let newStatus = task.status;
    if (task.status === "todo") {
      newStatus = "in-progress";
    } else if (task.status === "in-progress") {
      newStatus = "done";
    }

    if (newStatus !== task.status) {
      onStatusChange({ ...task, status: newStatus });
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-medium text-lg mb-1">{task.title}</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge
                variant="outline"
                className={getPriorityColor(task.priority)}
              >
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

          <div className="relative" ref={dropdownRef}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-muted border rounded-md shadow-md z-50">
                <button
                  className="w-full px-4 py-2 text-left hover:bg-muted flex items-center"
                  onClick={() => {
                    onEdit(task);
                    setShowDropdown(false);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </button>
                <button
                  className="w-full px-4 py-2 text-left text-destructive hover:bg-muted flex items-center"
                  onClick={() => {
                    onDelete(task.id);
                    setShowDropdown(false);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div
          className={`mt-2 text-sm text-muted-foreground ${
            isExpanded ? "" : "line-clamp-2"
          }`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {task.description}
        </div>

        <div className="mt-3 text-xs text-muted-foreground">
          {task.start_date && task.end_date && (
            <div className="flex justify-between">
              <span>
                Start: {format(new Date(task.start_date), "MMM d, yyyy")}
              </span>
              <span>Due: {format(new Date(task.end_date), "MMM d, yyyy")}</span>
            </div>
          )}
        </div>

        <div className="mt-3 flex justify-between">
          {task.status === "todo" && <div></div>}

          {task.status !== "done" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMoveForward}
              className="h-8 ml-auto"
            >
              Move Forward <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
