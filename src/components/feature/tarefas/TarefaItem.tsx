import React from "react";
import { Task } from "@/hooks/use-tasks";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CalendarDays, User2, X } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";

export default function TarefaItem({ task }: { task: Task }) {
  const { removeTask, toggleComplete } = useTasks();
  return (
    <div className="flex items-center gap-4 p-4 border rounded-xl bg-white shadow-sm mb-2">
      <Checkbox checked={task.completed} onCheckedChange={() => toggleComplete(task.id)} />
      <div className="flex-1">
        <div className="font-medium text-base line-clamp-1" style={{ textDecoration: task.completed ? 'line-through' : undefined }}>{task.title}</div>
        <div className="flex gap-4 text-xs text-muted-foreground mt-1">
          <span className="flex items-center gap-1"><CalendarDays className="size-3" />{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</span>
          <span className="flex items-center gap-1"><User2 className="size-3" />{task.assignee}</span>
        </div>
      </div>
      <Button variant="ghost" size="icon" aria-label="Remover tarefa" onClick={() => removeTask(task.id)}>
        <X className="size-4" />
      </Button>
    </div>
  );
} 