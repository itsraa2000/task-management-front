import type { Task } from "../api/tasks";
import TaskCard from "./task-card"; // ✅ Import your TaskCard component

interface TaskListProps {
  title: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onStatusChange: (task: Task) => void;
  nextStatusLabel: string; // ✅ Not used anymore (handled in TaskCard)
}

export default function TaskList({
  title,
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskListProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center py-8 border border-dashed rounded-lg">
            No tasks in this column
          </p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
}