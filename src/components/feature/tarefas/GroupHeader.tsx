import React from "react"
import { Separator } from "@/components/ui/separator"
import { Check } from "lucide-react"

interface GroupHeaderProps {
  label: string
  count: number
}

export default function GroupHeader({ label, count }: GroupHeaderProps) {
  const isCompleted = label === "Concluído"
  
  return (
    <div className="flex items-center gap-3 py-4">
      <Separator className="flex-1" />
      <div className={`flex items-center gap-2 text-sm font-medium ${
        isCompleted ? "text-blue-600" : "text-muted-foreground"
      }`}>
        {isCompleted && <Check className="size-4" />}
        <span>{label}</span>
        <span className={`px-2 py-0.5 rounded-full text-xs ${
          isCompleted 
            ? "bg-blue-100 text-blue-700" 
            : "bg-muted"
        }`}>
          {count} {count === 1 ? 'tarefa' : 'tarefas'}
        </span>
      </div>
      <Separator className="flex-1" />
    </div>
  )
} 