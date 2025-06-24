import React from "react"
import { Separator } from "@/components/ui/separator"

interface GroupHeaderProps {
  label: string
  count: number
}

export default function GroupHeader({ label, count }: GroupHeaderProps) {
  return (
    <div className="flex items-center gap-3 py-4">
      <Separator className="flex-1" />
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <span>{label}</span>
        <span className="bg-muted px-2 py-0.5 rounded-full text-xs">
          {count} {count === 1 ? 'tarefa' : 'tarefas'}
        </span>
      </div>
      <Separator className="flex-1" />
    </div>
  )
} 