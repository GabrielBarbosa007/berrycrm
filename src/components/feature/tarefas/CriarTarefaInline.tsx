"use client"

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { User2, X, CornerDownLeft } from "lucide-react";
import { AssignedUsersSelector, User } from "@/components/feature/tarefas/AssignedUsersSelector"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { toast } from "sonner";

import { DateSelector } from "@/components/feature/tarefas/DateSelector"; // <-- ✅ Novo import
import { useTarefas } from "@/context/TarefasContext"
import { Tarefa } from "@/types/task"
import { v4 as uuidv4 } from "uuid"

interface CriarTarefaInlineProps {
  onClose?: () => void
  tarefaParaEditar?: Tarefa | null
}

export default function CriarTarefaInline({ onClose, tarefaParaEditar }: CriarTarefaInlineProps) {
  const isEditando = !!tarefaParaEditar
  const { adicionarTarefa, editarTarefa } = useTarefas()
  const [titulo, setTitulo] = React.useState(tarefaParaEditar?.titulo || "")
  const [data, setData] = React.useState<Date | null>(tarefaParaEditar?.data || new Date())
  const [assigned, setAssigned] = React.useState<User[]>([])
  const [showAssignedPopover, setShowAssignedPopover] = React.useState(false)
  const [createMore, setCreateMore] = React.useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("berrycrm_createMore")
      return stored === "true"
    }
    return false
  })
  const [isLoading, setIsLoading] = React.useState(false)
  const tituloRef = React.useRef<HTMLTextAreaElement>(null)
  const [resetAnim, setResetAnim] = React.useState(false)

  React.useEffect(() => {
    setTitulo(tarefaParaEditar?.titulo || "")
    setData(tarefaParaEditar?.data || new Date())
    setAssigned([])
  }, [tarefaParaEditar])

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && onClose) onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Persistência do toggle
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("berrycrm_createMore", String(createMore))
    }
  }, [createMore])

  // Reset suave
  const resetForm = () => {
    setResetAnim(true)
    setTitulo("")
    setData(new Date())
    setAssigned([])
    setTimeout(() => {
      setResetAnim(false)
      tituloRef.current?.focus()
    }, 250)
  }

  const salvar = async () => {
    if (isLoading) return
    if (!titulo || !data) {
      toast.error("Preencha o título e a data.")
      return
    }
    setIsLoading(true)
    const novaTarefa: Tarefa = {
      id: tarefaParaEditar?.id || uuidv4(),
      titulo,
      data,
      usuario: assigned[0]?.name || "Gabriel Barbosa",
    }
    try {
      if (isEditando) {
        await editarTarefa(novaTarefa)
      } else {
        await adicionarTarefa(novaTarefa)
      }
      if (createMore && !isEditando) {
        resetForm()
        toast.success("Tarefa criada! Crie outra ou feche quando quiser.")
      } else {
        setTitulo("")
        setData(new Date())
        setAssigned([])
        onClose?.()
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="w-full max-w-[768px] mx-auto mt-6 rounded-2xl border bg-card px-6 pt-4 pb-3 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Checkbox id="create-task" />
          <Label htmlFor="create-task" className="text-lg font-semibold select-none cursor-pointer">{isEditando ? "Edit Task" : "Create Task"}</Label>
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground" aria-label="Fechar" onClick={onClose}>
          <X className="size-5" />
        </Button>
      </div>
      
      {/* Textarea */}
      <Textarea
        ref={tituloRef}
        className={`resize-none border-0 shadow-none ring-0 focus-visible:ring-0 focus-visible:border-0 text-lg px-0 py-2 min-h-[44px] placeholder:text-muted-foreground placeholder:font-normal placeholder:text-[20px] bg-transparent ${resetAnim ? "animate-pulse" : ""}`}
        placeholder="Schedule a demo with @Contact"
        value={titulo}
        onChange={e => setTitulo(e.target.value)}
      />
      
      {/* Footer */}
      <div className="flex items-center gap-3 mt-3 w-full overflow-x-auto">
        <DateSelector value={data} onChange={setData} />
        {/* Assigned to You + Selector */}
        <Popover open={showAssignedPopover} onOpenChange={setShowAssignedPopover}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-1 px-2 h-8 text-base font-normal whitespace-nowrap" onClick={() => setShowAssignedPopover(true)}>
              <User2 className="size-4" />{assigned[0]?.name || "Assigned to You"}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="p-0 w-[340px]">
            <AssignedUsersSelector value={assigned} onChange={setAssigned} />
          </PopoverContent>
        </Popover>
        <div className="flex items-center gap-2 ml-2">
          <Switch id="create-more" checked={createMore} onCheckedChange={setCreateMore} />
          <Label htmlFor="create-more" className="text-base font-normal cursor-pointer whitespace-nowrap ml-1">Create more</Label>
        </div>
        <Button variant="ghost" className="h-9 px-4 text-base font-normal text-muted-foreground ml-2" onClick={onClose}>
          Cancel <span className="ml-1 text-xs">ESC</span>
        </Button>
        <Button
          variant="default"
          className="h-9 px-5 text-base font-semibold flex items-center gap-2"
          onClick={salvar}
          disabled={isLoading}
        >
          {isLoading ? "Salvando..." : <>Save <CornerDownLeft className="size-4 ml-1" /></>}
        </Button>
      </div>
    </div>
  );
}
