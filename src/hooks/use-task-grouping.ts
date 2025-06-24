import { useMemo } from "react"
import { Tarefa, GroupField, SortField, SortDirection } from "@/types/task"

export function useTaskGrouping(
  tarefas: Tarefa[], 
  groupField: GroupField, 
  showCompleted: boolean,
  sortField?: SortField,
  sortDirection?: SortDirection
) {
  return useMemo(() => {
    // Função para obter valor de agrupamento
    const getGroupValue = (tarefa: Tarefa): string => {
      // Se a tarefa está concluída e showCompleted é true, sempre agrupar em "Concluído"
      if (tarefa.concluida && showCompleted) {
        return "Concluído"
      }
      
      // Se showCompleted é false, não incluir tarefas concluídas
      if (tarefa.concluida && !showCompleted) {
        return ""
      }

      // Para tarefas não concluídas, usar o agrupamento normal
      switch (groupField) {
        case "due":
          if (!tarefa.data) return "Sem data"
          const hoje = new Date()
          const amanha = new Date(hoje)
          amanha.setDate(amanha.getDate() + 1)
          
          const tarefaDate = new Date(tarefa.data)
          tarefaDate.setHours(0, 0, 0, 0)
          hoje.setHours(0, 0, 0, 0)
          amanha.setHours(0, 0, 0, 0)
          
          if (tarefaDate.getTime() === hoje.getTime()) return "Hoje"
          if (tarefaDate.getTime() === amanha.getTime()) return "Amanhã"
          if (tarefaDate < hoje) return "Vencidas"
          return "Próximas"
        case "assignee":
          return tarefa.usuario || "Sem responsável"
        case "created":
          if (!tarefa.createdAt) return "Sem data de criação"
          const createdDate = new Date(tarefa.createdAt)
          const hojeCreated = new Date()
          const diffTime = hojeCreated.getTime() - createdDate.getTime()
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          
          if (diffDays === 0) return "Criadas hoje"
          if (diffDays === 1) return "Criadas ontem"
          if (diffDays <= 7) return "Criadas esta semana"
          return "Criadas anteriormente"
        case "createdBy":
          return tarefa.createdBy || "Desconhecido"
        default:
          return "Outros"
      }
    }

    // Função para comparar tarefas para ordenação
    const compareTarefas = (a: Tarefa, b: Tarefa): number => {
      if (!sortField || !sortDirection) return 0
      
      let aValue: string | number
      let bValue: string | number

      switch (sortField) {
        case "due":
          aValue = a.data ? new Date(a.data).getTime() : 0
          bValue = b.data ? new Date(b.data).getTime() : 0
          break
        case "assignee":
          aValue = a.usuario || ""
          bValue = b.usuario || ""
          break
        case "created":
          aValue = a.createdAt ? new Date(a.createdAt).getTime() : 0
          bValue = b.createdAt ? new Date(b.createdAt).getTime() : 0
          break
        default:
          return 0
      }

      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    }

    // Agrupar tarefas
    const grupos: { [key: string]: Tarefa[] } = {}
    
    tarefas.forEach(tarefa => {
      const groupKey = getGroupValue(tarefa)
      if (groupKey) { // Só adicionar se tiver um grupo válido
        if (!grupos[groupKey]) {
          grupos[groupKey] = []
        }
        grupos[groupKey].push(tarefa)
      }
    })

    // Ordenar tarefas dentro de cada grupo
    Object.keys(grupos).forEach(groupKey => {
      grupos[groupKey].sort(compareTarefas)
    })

    // Criar cabeçalhos dos grupos
    const headers = Object.keys(grupos).map(key => ({
      key,
      label: key,
      count: grupos[key].length
    })).sort((a, b) => {
      // Ordenar cabeçalhos por prioridade - "Concluído" sempre por último
      if (a.key === "Concluído") return 1
      if (b.key === "Concluído") return -1
      
      const priority = { "Vencidas": 0, "Hoje": 1, "Amanhã": 2, "Próximas": 3 }
      const aPriority = priority[a.key as keyof typeof priority] ?? 4
      const bPriority = priority[b.key as keyof typeof priority] ?? 4
      return aPriority - bPriority
    })

    return { processedTarefas: grupos, groupHeaders: headers }
  }, [tarefas, groupField, showCompleted, sortField, sortDirection])
} 