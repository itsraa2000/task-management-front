import type { Task } from "../lib/types"
import TaskCard from "./task-card"

interface TaskListProps {
  title: string
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onStatusChange: (task: Task) => void
}

export default function TaskList({ title, tasks, onEdit, onDelete, onStatusChange }: TaskListProps) {
  return (
    <div className="bg-card rounded-lg shadow-sm border p-4">
      <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
        {title}
        <span className="text-sm font-normal bg-primary/10 text-primary px-2 py-1 rounded">{tasks.length}</span>
      </h2>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No tasks</p>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
          ))
        )}
      </div>
    </div>
  )
}

