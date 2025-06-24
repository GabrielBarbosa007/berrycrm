import { useMemo } from "react"
import { Tarefa } from "@/types/task"

export interface TaskFilterState {
  title: string
  assignee: string
  dueStart: Date | null
  dueEnd: Date | null
  tags: string[]
}

export function useTaskFiltering(
  tarefas: Tarefa[], 
  filter: TaskFilterState, 
  showCompleted: boolean
) {
  return useMemo(() => {
    return tarefas.filter(t => {
      // Se showCompleted é false, excluir tarefas concluídas
      if (!showCompleted && t.concluida) return false
      
      // Aplicar outros filtros
      if (filter.title && !t.titulo.toLowerCase().includes(filter.title.toLowerCase())) return false
      if (filter.assignee && t.usuario !== filter.assignee) return false
      if (filter.dueStart && (!t.data || new Date(t.data) < filter.dueStart)) return false
      if (filter.dueEnd && (!t.data || new Date(t.data) > filter.dueEnd)) return false
      // Tags/status: placeholder
      if (filter.tags.length > 0) return false // ajuste quando houver tags
      return true
    })
  }, [tarefas, filter, showCompleted])
} 