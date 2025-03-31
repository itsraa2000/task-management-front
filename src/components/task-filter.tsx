import type { Status, Priority } from "../lib/types"
import type { Dispatch, SetStateAction } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"

interface TaskFiltersProps {
  statusFilter: Status | "all"
  priorityFilter: Priority | "all"
  onStatusFilterChange: Dispatch<SetStateAction<Status | "all">>
  onPriorityFilterChange: Dispatch<SetStateAction<Priority | "all">>
}

export default function TaskFilters({
  statusFilter,
  priorityFilter,
  onStatusFilterChange,
  onPriorityFilterChange,
}: TaskFiltersProps) {
  return (
    <div className="bg-card rounded-lg shadow-sm border p-4 mb-6">
      <h2 className="text-lg font-medium mb-4">Filters</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium mb-2">
            Status
          </label>
          <Select value={statusFilter} onValueChange={(value) => onStatusFilterChange(value as Status | "all")}>
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="priority-filter" className="block text-sm font-medium mb-2">
            Priority
          </label>
          <Select value={priorityFilter} onValueChange={(value) => onPriorityFilterChange(value as Priority | "all")}>
            <SelectTrigger id="priority-filter">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

