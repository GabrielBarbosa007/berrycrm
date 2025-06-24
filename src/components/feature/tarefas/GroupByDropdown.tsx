import React from "react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Settings2, ChevronDown, Check, CalendarDays, User2, CalendarPlus } from "lucide-react"
import { GroupField } from "@/types/task"

const GROUP_FIELDS = [
  { label: "Data de vencimento", value: "due" as GroupField, icon: CalendarDays },
  { label: "Cessionário", value: "assignee" as GroupField, icon: User2 },
  { label: "Data de criação", value: "created" as GroupField, icon: CalendarPlus },
  { label: "Criado por", value: "createdBy" as GroupField, icon: User2 },
]

interface GroupByDropdownProps {
  groupField: GroupField
  showCompleted: boolean
  onGroupFieldChange: (field: GroupField) => void
  onShowCompletedChange: (show: boolean) => void
}

export default function GroupByDropdown({
  groupField,
  showCompleted,
  onGroupFieldChange,
  onShowCompletedChange,
}: GroupByDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <Settings2 className="size-4" />
          <span>Configurações de exibição</span>
          <ChevronDown className="size-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 p-1">
        <DropdownMenuLabel className="text-xs text-muted-foreground px-2 pt-2 pb-1 cursor-default select-none">
          Agrupar por
        </DropdownMenuLabel>
        {GROUP_FIELDS.map(f => {
          const Icon = f.icon
          const selected = groupField === f.value
          return (
            <DropdownMenuItem
              key={f.value}
              className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm font-normal ${selected ? 'bg-accent/60 text-foreground' : ''}`}
              onClick={() => onGroupFieldChange(f.value)}
            >
              <Icon className="size-4" />
              <span>{f.label}</span>
              {selected && <Check className="size-4 ml-auto text-primary" />}
            </DropdownMenuItem>
          )
        })}
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuCheckboxItem
          checked={showCompleted}
          onCheckedChange={onShowCompletedChange}
          className="flex items-center gap-2 px-2 py-2"
        >
          <Switch checked={showCompleted} />
          <span>Mostrar tarefas concluídas</span>
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 