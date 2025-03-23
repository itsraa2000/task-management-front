import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Task } from "../lib/types";
import { mockTasks } from "../lib/mock-data";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks] = useState<Task[]>(mockTasks);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const getTasksForDay = (day: Date) => {
    return tasks.filter((task) => {
      if (!task.startDate) return false;
      const taskDate = new Date(task.startDate);
      return isSameDay(taskDate, day);
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Task Calendar</h1>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{format(currentDate, "MMMM yyyy")}</CardTitle>
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
              <div
                key={`empty-start-${index}`}
                className="h-24 border rounded-md bg-muted/20"
              ></div>
            ))}

            {monthDays.map((day) => {
              const dayTasks = getTasksForDay(day);
              return (
                <div
                  key={day.toString()}
                  className={`h-24 border rounded-md p-1 overflow-hidden ${
                    isSameMonth(day, currentDate) ? "bg-card" : "bg-muted/20"
                  }`}
                >
                  <div className="text-right mb-1">
                    <span className="text-sm font-medium">
                      {format(day, "d")}
                    </span>
                  </div>
                  <div className="space-y-1 overflow-y-auto max-h-[calc(100%-20px)]">
                    {dayTasks.map((task) => (
                      <div
                        key={task.id}
                        className="text-xs p-1 rounded truncate flex items-center"
                      >
                        <span
                          className={`w-2 h-2 rounded-full mr-1 ${getPriorityColor(
                            task.priority
                          )}`}
                        ></span>
                        {task.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {Array.from({ length: 6 - monthEnd.getDay() }).map((_, index) => (
              <div
                key={`empty-end-${index}`}
                className="h-24 border rounded-md bg-muted/20"
              ></div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
