import React from "react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { SlidersHorizontal, ChevronDown, Check, CalendarDays, User2, CalendarPlus, ArrowUp01, ArrowDown01 } from "lucide-react"
import { SortField, SortDirection } from "@/context/TarefasContext"

const ORDER_FIELDS = [
  { label: "Data de vencimento", value: "due" as SortField, icon: CalendarDays },
  { label: "Cessionário", value: "assignee" as SortField, icon: User2 },
  { label: "Data de criação", value: "created" as SortField, icon: CalendarPlus },
]

const ORDER_DIRECTIONS = [
  { label: "Ascendente", value: "asc" as SortDirection, icon: ArrowUp01 },
  { label: "Descendente", value: "desc" as SortDirection, icon: ArrowDown01 },
]

interface SortDropdownProps {
  sortField: SortField
  sortDirection: SortDirection
  onSortFieldChange: (field: SortField) => void
  onSortDirectionChange: (direction: SortDirection) => void
}

export default function SortDropdown({
  sortField,
  sortDirection,
  onSortFieldChange,
  onSortDirectionChange,
}: SortDropdownProps) {
  const selectedField = ORDER_FIELDS.find(f => f.value === sortField)
  const selectedDirection = ORDER_DIRECTIONS.find(d => d.value === sortDirection)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center border border-input rounded-md px-3 py-1.5 bg-white shadow-sm text-sm font-normal text-muted-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring/50 transition min-w-[270px] max-w-full truncate"
          style={{ fontWeight: 500 }}
        >
          <SlidersHorizontal className="size-4 mr-1 text-muted-foreground" />
          <span className="text-muted-foreground">Classificado por</span>
          <span className="mx-1 font-semibold text-foreground truncate">{selectedField?.label}</span>
          <span className="text-muted-foreground">{selectedDirection?.label}</span>
          <ChevronDown className="size-4 ml-1 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 p-1">
        {ORDER_FIELDS.map(f => {
          const Icon = f.icon
          return (
            <DropdownMenuItem
              key={f.value}
              className="flex items-center gap-2"
              onClick={() => onSortFieldChange(f.value)}
            >
              <Icon className="size-4" />
              <span>{f.label}</span>
              {sortField === f.value && <Check className="size-4 ml-auto text-primary" />}
            </DropdownMenuItem>
          )
        })}
        <div className="my-1 h-px bg-border" />
        {ORDER_DIRECTIONS.map(d => {
          const Icon = d.icon
          return (
            <DropdownMenuItem
              key={d.value}
              className="flex items-center gap-2"
              onClick={() => onSortDirectionChange(d.value)}
            >
              <Icon className="size-4" />
              <span>{d.label}</span>
              {sortDirection === d.value && <Check className="size-4 ml-auto text-primary" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 