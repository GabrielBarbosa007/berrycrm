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

import { DateSelector } from "@/components/feature/tarefas/DateSelector"; // <-- ✅ Novo import
import { useTarefas } from "@/context/TarefasContext"
import { v4 as uuidv4 } from "uuid"

export default function CriarTarefaInline({ onClose }: { onClose?: () => void }) {
  const { adicionarTarefa } = useTarefas()
  const [titulo, setTitulo] = React.useState("")
  const [data, setData] = React.useState<Date | null>(new Date())
  const [assigned, setAssigned] = React.useState<User[]>([])
  const [showAssignedPopover, setShowAssignedPopover] = React.useState(false)

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && onClose) onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const salvar = () => {
    if (!titulo) return
    adicionarTarefa({
      id: uuidv4(),
      titulo,
      data,
      usuario: assigned[0]?.name || "Gabriel Barbosa",
    })
    setTitulo("")
    setData(new Date())
    setAssigned([])
    onClose?.()
  }

  return (
    <div
      className="w-full max-w-[768px] mx-auto mt-6 rounded-2xl border bg-white px-6 pt-4 pb-3 shadow-[0_4px_32px_0_rgba(16,30,54,0.08)]"
      style={{ boxShadow: "0 4px 32px 0 rgba(16,30,54,0.08)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Checkbox id="create-task" />
          <Label htmlFor="create-task" className="text-lg font-semibold select-none cursor-pointer">Create Task</Label>
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground" aria-label="Fechar" onClick={onClose}>
          <X className="size-5" />
        </Button>
      </div>
      
      {/* Textarea */}
      <Textarea
        className="resize-none border-0 shadow-none ring-0 focus-visible:ring-0 focus-visible:border-0 text-lg px-0 py-2 min-h-[44px] placeholder:text-muted-foreground placeholder:font-normal placeholder:text-[20px]"
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
          <Switch id="create-more" />
          <Label htmlFor="create-more" className="text-base font-normal cursor-pointer whitespace-nowrap ml-1">Create more</Label>
        </div>
        <Button variant="ghost" className="h-9 px-4 text-base font-normal text-muted-foreground ml-2" onClick={onClose}>
          Cancel <span className="ml-1 text-xs">ESC</span>
        </Button>
        <Button
          className="h-9 px-5 text-base font-semibold bg-[#2563eb] hover:bg-[#1d4fd7] text-white flex items-center gap-2"
          onClick={salvar}
        >
          Save <CornerDownLeft className="size-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
