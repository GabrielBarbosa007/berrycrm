import React, { useState } from "react";
import { Task } from "@/hooks/use-tasks";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CalendarDays, User2, X } from "lucide-react";
import { Tarefa, useTarefas } from "@/context/TarefasContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";

function ConfirmDeleteModal({ open, onCancel, onConfirm }: { open: boolean, onCancel: () => void, onConfirm: () => void }) {
  return (
    <Dialog open={open} onOpenChange={open => { if (!open) onCancel(); }}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Delete task</DialogTitle>
          <DialogDescription>Are you sure you want to delete this task?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <button className="px-4 py-2 rounded-md border bg-white text-gray-700 hover:bg-gray-100" onClick={onCancel}>Cancel</button>
          </DialogClose>
          <button className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700" onClick={onConfirm}>Delete</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function TarefaItem({ tarefa, task, onEdit }: { tarefa?: Tarefa, task?: Task, onEdit?: () => void }) {
  const { removerTarefa, handleCompleteTask } = useTarefas();
  const [modalOpen, setModalOpen] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  // Preferir tarefa do contexto, mas manter compatibilidade com task
  const t = tarefa || (task ? {
    id: task.id,
    titulo: task.title,
    data: task.dueDate ? new Date(task.dueDate) : null,
    usuario: task.assignee,
    concluida: false,
  } : undefined)
  if (!t) return null

  async function onCheck(e: React.MouseEvent | React.TouchEvent) {
    e.stopPropagation();
    if (!t || isCompleting || t.concluida) return;
    setIsCompleting(true);
    try {
      await handleCompleteTask(t.id);
      setTimeout(() => removerTarefa(t.id), 300);
    } catch {
      toast.error("Erro ao concluir tarefa");
      setIsCompleting(false);
    }
  }

  function handleDeleteTask(id: string) {
    removerTarefa(id);
    setModalOpen(false);
  }

  function onDeleteClick(e: React.MouseEvent | React.TouchEvent) {
    e.stopPropagation();
    setModalOpen(true);
  }

  return (
    <div
      className={
        `flex items-center gap-4 p-4 border rounded-xl bg-white shadow-sm mb-2 transition-opacity duration-300 ${
          isCompleting || t.concluida ? "opacity-50 line-through text-gray-400 pointer-events-none" : ""
        }`
      }
    >
      <Checkbox
        checked={t.concluida || isCompleting}
        onClick={onCheck}
        disabled={isCompleting || t.concluida}
        className={`transition-all duration-300 ${isCompleting || t.concluida ? "bg-green-200 border-green-400" : ""}`}
      />
      <div
        className="flex-1 cursor-pointer rounded-md hover:bg-muted px-2 py-1 transition"
        onClick={() => onEdit && onEdit()}
        tabIndex={0}
        role="button"
        aria-label="Editar tarefa"
      >
        <div className="font-medium text-base line-clamp-1">{t.titulo}</div>
        <div className="flex gap-4 text-xs text-muted-foreground mt-1">
          <span className="flex items-center gap-1"><CalendarDays className="size-3" />{t.data ? new Date(t.data).toLocaleDateString() : '-'}</span>
          <span className="flex items-center gap-1"><User2 className="size-3" />{t.usuario}</span>
        </div>
      </div>
      <Button variant="ghost" size="icon" aria-label="Remover tarefa" onClick={onDeleteClick}>
        <X className="size-4" />
      </Button>
      <ConfirmDeleteModal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onConfirm={() => handleDeleteTask(t.id)}
      />
    </div>
  );
} 