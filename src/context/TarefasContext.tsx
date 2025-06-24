"use client"

import { createContext, useContext, useState, useMemo, useEffect } from "react"

export interface Tarefa {
  id: string
  titulo: string
  data: Date | null
  usuario: string
  concluida?: boolean
  createdAt?: Date
  createdBy?: string
}

export type SortField = "due" | "assignee" | "created"
export type SortDirection = "asc" | "desc"
export type GroupField = "due" | "assignee" | "created" | "createdBy"

interface TarefasContextType {
  tarefas: Tarefa[]
  adicionarTarefa: (nova: Tarefa) => void
  editarTarefa: (tarefaEditada: Tarefa) => void
  removerTarefa: (id: string) => void
  handleCompleteTask: (id: string) => Promise<void>
  
  // Estados de ordenação e agrupamento
  sortField: SortField
  sortDirection: SortDirection
  groupField: GroupField
  showCompleted: boolean
  
  // Funções para manipular estados
  setSortField: (field: SortField) => void
  setSortDirection: (direction: SortDirection) => void
  setGroupField: (field: GroupField) => void
  setShowCompleted: (show: boolean) => void
  
  // Tarefas processadas (filtradas, agrupadas e ordenadas)
  processedTarefas: { [key: string]: Tarefa[] }
  groupHeaders: { key: string; label: string; count: number }[]
  
  // Função para processar tarefas com filtros
  processTarefasWithFilters: (tarefasFiltradas: Tarefa[]) => { processedTarefas: { [key: string]: Tarefa[] }, groupHeaders: { key: string; label: string; count: number }[] }
}

const TarefasContext = createContext<TarefasContextType | undefined>(undefined)

export const TarefasProvider = ({ children }: { children: React.ReactNode }) => {
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  
  // Estados de ordenação e agrupamento
  const [sortField, setSortField] = useState<SortField>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("berrycrm_sortField") as SortField) || "due"
    }
    return "due"
  })
  const [sortDirection, setSortDirection] = useState<SortDirection>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("berrycrm_sortDirection") as SortDirection) || "asc"
    }
    return "asc"
  })
  const [groupField, setGroupField] = useState<GroupField>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("berrycrm_groupField") as GroupField) || "due"
    }
    return "due"
  })
  const [showCompleted, setShowCompleted] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("berrycrm_showCompleted")
      return stored === null ? true : stored === "true"
    }
    return true
  })

  // Persistência no localStorage
  useEffect(() => {
    localStorage.setItem("berrycrm_sortField", sortField)
  }, [sortField])
  useEffect(() => {
    localStorage.setItem("berrycrm_sortDirection", sortDirection)
  }, [sortDirection])
  useEffect(() => {
    localStorage.setItem("berrycrm_groupField", groupField)
  }, [groupField])
  useEffect(() => {
    localStorage.setItem("berrycrm_showCompleted", String(showCompleted))
  }, [showCompleted])

  const adicionarTarefa = (nova: Tarefa) => {
    const tarefaCompleta = {
      ...nova,
      createdAt: new Date(),
      createdBy: "Usuário Atual", // Substitua por usuário real do sistema
    }
    setTarefas(prev => [...prev, tarefaCompleta])
  }

  const editarTarefa = (tarefaEditada: Tarefa) => {
    setTarefas(prev => prev.map(t => (t.id === tarefaEditada.id ? tarefaEditada : t)))
  }

  const removerTarefa = (id: string) => {
    setTarefas(prev => prev.filter(t => t.id !== id))
  }

  const handleCompleteTask = async (id: string) => {
    try {
      setTarefas(prev => prev.map(t => t.id === id ? { ...t, concluida: true } : t))
      // Simular persistência backend (substitua por chamada real se necessário)
      await new Promise(res => setTimeout(res, 100))
    } catch (e) {
      // fallback de erro
      setTarefas(prev => prev.map(t => t.id === id ? { ...t, concluida: false } : t))
      throw e
    }
  }

  // Processar tarefas (filtrar, agrupar e ordenar)
  const { processedTarefas, groupHeaders } = useMemo(() => {
    // Função para obter valor de agrupamento
    const getGroupValue = (tarefa: Tarefa): string => {
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

    // Filtrar tarefas concluídas se necessário
    const tarefasFiltradas = showCompleted 
      ? tarefas 
      : tarefas.filter(t => !t.concluida)

    // Agrupar tarefas
    const grupos: { [key: string]: Tarefa[] } = {}
    
    tarefasFiltradas.forEach(tarefa => {
      const groupKey = getGroupValue(tarefa)
      if (!grupos[groupKey]) {
        grupos[groupKey] = []
      }
      grupos[groupKey].push(tarefa)
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
      // Ordenar cabeçalhos por prioridade
      const priority = { "Vencidas": 0, "Hoje": 1, "Amanhã": 2, "Próximas": 3 }
      const aPriority = priority[a.key as keyof typeof priority] ?? 4
      const bPriority = priority[b.key as keyof typeof priority] ?? 4
      return aPriority - bPriority
    })

    return { processedTarefas: grupos, groupHeaders: headers }
  }, [tarefas, showCompleted, sortField, sortDirection, groupField])

  // Função para processar tarefas com filtros
  const processTarefasWithFilters = (tarefasFiltradas: Tarefa[]) => {
    // Função para obter valor de agrupamento
    const getGroupValue = (tarefa: Tarefa): string => {
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
    
    tarefasFiltradas.forEach(tarefa => {
      const groupKey = getGroupValue(tarefa)
      if (!grupos[groupKey]) {
        grupos[groupKey] = []
      }
      grupos[groupKey].push(tarefa)
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
      // Ordenar cabeçalhos por prioridade
      const priority = { "Vencidas": 0, "Hoje": 1, "Amanhã": 2, "Próximas": 3 }
      const aPriority = priority[a.key as keyof typeof priority] ?? 4
      const bPriority = priority[b.key as keyof typeof priority] ?? 4
      return aPriority - bPriority
    })

    return { processedTarefas: grupos, groupHeaders: headers }
  }

  return (
    <TarefasContext.Provider value={{ 
      tarefas, 
      adicionarTarefa, 
      editarTarefa, 
      removerTarefa, 
      handleCompleteTask,
      sortField,
      sortDirection,
      groupField,
      showCompleted,
      setSortField,
      setSortDirection,
      setGroupField,
      setShowCompleted,
      processedTarefas,
      groupHeaders,
      processTarefasWithFilters
    }}>
      {children}
    </TarefasContext.Provider>
  )
}

export const useTarefas = () => {
  const context = useContext(TarefasContext)
  if (!context) throw new Error("useTarefas deve estar dentro de TarefasProvider")
  return context
} 