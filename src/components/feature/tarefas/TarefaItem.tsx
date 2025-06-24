import React from "react";
import { Task } from "@/hooks/use-tasks";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CalendarDays, User2, X } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { Tarefa } from "@/context/TarefasContext"

export default function TarefaItem({ tarefa, task }: { tarefa?: Tarefa, task?: Task }) {
  const { removeTask, toggleComplete } = useTasks();
  // Preferir tarefa do contexto, mas manter compatibilidade com task
  const t = tarefa || (task ? {
    id: task.id,
    titulo: task.title,
    data: task.dueDate ? new Date(task.dueDate) : null,
    usuario: task.assignee,
  } : undefined)
  if (!t) return null
  return (
    <div className="flex items-center gap-4 p-4 border rounded-xl bg-white shadow-sm mb-2">
      <Checkbox checked={false} />
      <div className="flex-1">
        <div className="font-medium text-base line-clamp-1">{t.titulo}</div>
        <div className="flex gap-4 text-xs text-muted-foreground mt-1">
          <span className="flex items-center gap-1"><CalendarDays className="size-3" />{t.data ? new Date(t.data).toLocaleDateString() : '-'}</span>
          <span className="flex items-center gap-1"><User2 className="size-3" />{t.usuario}</span>
        </div>
      </div>
      <Button variant="ghost" size="icon" aria-label="Remover tarefa" onClick={() => removeTask(t.id)}>
        <X className="size-4" />
      </Button>
    </div>
  );
} 