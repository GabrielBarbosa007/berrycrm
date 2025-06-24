import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X, Filter } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { DateSelector } from "./DateSelector"
import { TaskFilterState } from "@/types/task"

interface TaskFilterProps {
  value: TaskFilterState
  onChange: (value: TaskFilterState) => void
  assignees: string[]
  tags?: string[]
  onClear: () => void
}

export default function TaskFilter({ value, onChange, assignees, tags = [], onClear }: TaskFilterProps) {
  const [open, setOpen] = React.useState(false)

  function handleFieldChange<K extends keyof TaskFilterState>(field: K, val: TaskFilterState[K]) {
    onChange({ ...value, [field]: val })
  }

  function removeTag(tag: string) {
    onChange({ ...value, tags: value.tags.filter(t => t !== tag) })
  }

  function clearAll() {
    onClear()
    setOpen(false)
  }

  // Chips dos filtros aplicados
  const chips = [
    value.title && { label: `Título: "${value.title}"`, onRemove: () => handleFieldChange("title", "") },
    value.assignee && { label: `Cessionário: ${value.assignee}`, onRemove: () => handleFieldChange("assignee", "") },
    value.dueStart && { label: `Venc. de: ${value.dueStart.toLocaleDateString()}`, onRemove: () => handleFieldChange("dueStart", null) },
    value.dueEnd && { label: `Venc. até: ${value.dueEnd.toLocaleDateString()}`, onRemove: () => handleFieldChange("dueEnd", null) },
    ...value.tags.map(tag => ({ label: `Tag: ${tag}`, onRemove: () => removeTag(tag) })),
  ].filter(Boolean)

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 border border-dashed border-input bg-white text-muted-foreground">
            <Filter className="size-4" />
            <span>Filtro</span>
            {chips.length > 0 && <span className="ml-2 text-xs text-primary">({chips.length})</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[340px] p-4">
          <div className="flex flex-col gap-3">
            <Input
              placeholder="Buscar por título..."
              value={value.title}
              onChange={e => handleFieldChange("title", e.target.value)}
            />
            <div>
              <label className="block text-xs mb-1">Cessionário</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={value.assignee}
                onChange={e => handleFieldChange("assignee", e.target.value)}
              >
                <option value="">Todos</option>
                {assignees.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 items-center">
              <label className="text-xs">Vencimento:</label>
              <DateSelector value={value.dueStart} onChange={date => handleFieldChange("dueStart", date)} />
              <span className="mx-1 text-xs">até</span>
              <DateSelector value={value.dueEnd} onChange={date => handleFieldChange("dueEnd", date)} />
            </div>
            {tags.length > 0 && (
              <div>
                <label className="block text-xs mb-1">Tags</label>
                <div className="flex flex-wrap gap-1">
                  {tags.map(tag => (
                    <Button
                      key={tag}
                      size="sm"
                      variant={value.tags.includes(tag) ? "default" : "outline"}
                      className="text-xs px-2 py-1"
                      onClick={() => handleFieldChange("tags", value.tags.includes(tag) ? value.tags.filter(t => t !== tag) : [...value.tags, tag])}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={clearAll}>Limpar</Button>
              <Button variant="default" size="sm" className="flex-1" onClick={() => setOpen(false)}>Aplicar</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Chips dos filtros aplicados */}
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {chips.map((chip, i) => (
            chip && (
              <span key={i} className="flex items-center bg-muted px-2 py-1 rounded-full text-xs">
                {chip.label}
                <button className="ml-1" onClick={chip.onRemove}><X className="size-3" /></button>
              </span>
            )
          ))}
          <Button variant="ghost" size="sm" className="text-xs" onClick={clearAll}>Limpar todos</Button>
        </div>
      )}
    </div>
  )
} 