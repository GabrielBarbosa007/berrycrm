import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CalendarDays, User2, X, Check } from "lucide-react";
import { useTarefas } from "@/context/TarefasContext";
import { Tarefa } from "@/types/task";
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
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={onConfirm}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function TarefaItem({ tarefa, onEdit }: { tarefa: Tarefa, onEdit?: () => void }) {
  const { removerTarefa, handleCompleteTask } = useTarefas();
  const [modalOpen, setModalOpen] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  async function onCheck(e: React.MouseEvent | React.TouchEvent) {
    e.stopPropagation();
    if (isCompleting || tarefa.concluida) return;
    setIsCompleting(true);
    try {
      await handleCompleteTask(tarefa.id);
      // Não remover automaticamente - deixar o contexto gerenciar a exibição
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

  const isCompleted = tarefa.concluida || isCompleting;

  return (
    <div
      className={
        `flex items-center gap-4 p-4 border rounded-xl bg-card shadow-sm mb-2 transition-all duration-300 ${
          isCompleted 
            ? "opacity-60 bg-muted/50" 
            : "hover:shadow-md"
        }`
      }
    >
      {isCompleted ? (
        <div className="flex items-center justify-center w-4 h-4 rounded border-2 bg-primary border-primary">
          <Check className="w-3 h-3 text-primary-foreground" />
        </div>
      ) : (
        <Checkbox
          checked={false}
          onClick={onCheck}
          disabled={isCompleting}
          className="transition-all duration-300"
        />
      )}
      <div
        className={`flex-1 rounded-md px-2 py-1 transition ${
          isCompleted 
            ? "cursor-default" 
            : "cursor-pointer hover:bg-accent"
        }`}
        onClick={() => !isCompleted && onEdit && onEdit()}
        tabIndex={isCompleted ? -1 : 0}
        role={isCompleted ? undefined : "button"}
        aria-label={isCompleted ? undefined : "Editar tarefa"}
      >
        <div className={`font-medium text-base line-clamp-1 ${
          isCompleted ? "text-muted-foreground line-through" : ""
        }`}>
          {tarefa.titulo}
        </div>
        <div className={`flex gap-4 text-xs mt-1 ${
          isCompleted ? "text-muted-foreground/60" : "text-muted-foreground"
        }`}>
          <span className="flex items-center gap-1">
            <CalendarDays className="size-3" />
            {tarefa.data ? new Date(tarefa.data).toLocaleDateString() : '-'}
          </span>
          <span className="flex items-center gap-1">
            <User2 className="size-3" />
            {tarefa.usuario}
          </span>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        aria-label="Remover tarefa" 
        onClick={onDeleteClick}
        className={isCompleted ? "opacity-50" : ""}
      >
        <X className="size-4" />
      </Button>
      <ConfirmDeleteModal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onConfirm={() => handleDeleteTask(tarefa.id)}
      />
    </div>
  );
} 