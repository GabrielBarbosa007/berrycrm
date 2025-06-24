"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useTaskGrouping } from "@/hooks/use-task-grouping"
import { useTaskFiltering } from "@/hooks/use-task-filtering"
import { 
  Tarefa, 
  SortField, 
  SortDirection, 
  GroupField, 
  TaskFilterState,
  ProcessedTarefas,
  GroupHeader
} from "@/types/task"

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
  processedTarefas: ProcessedTarefas
  groupHeaders: GroupHeader[]
}

const TarefasContext = createContext<TarefasContextType | undefined>(undefined)

export const TarefasProvider = ({ children }: { children: React.ReactNode }) => {
  const [tarefas, setTarefas] = useState<Tarefa[]>(() => {
    // Adicionar algumas tarefas de teste para demonstrar a funcionalidade
    const hoje = new Date()
    const amanha = new Date(hoje)
    amanha.setDate(amanha.getDate() + 1)
    const ontem = new Date(hoje)
    ontem.setDate(ontem.getDate() - 1)
    
    return [
      {
        id: "1",
        titulo: "Tarefa de hoje",
        data: hoje,
        usuario: "João",
        concluida: false,
        createdAt: new Date(),
        createdBy: "Sistema"
      },
      {
        id: "2",
        titulo: "Tarefa de amanhã",
        data: amanha,
        usuario: "Maria",
        concluida: false,
        createdAt: new Date(),
        createdBy: "Sistema"
      },
      {
        id: "3",
        titulo: "Tarefa vencida",
        data: ontem,
        usuario: "Pedro",
        concluida: false,
        createdAt: new Date(),
        createdBy: "Sistema"
      },
      {
        id: "4",
        titulo: "Tarefa concluída",
        data: hoje,
        usuario: "Ana",
        concluida: true,
        createdAt: new Date(),
        createdBy: "Sistema"
      },
      {
        id: "5",
        titulo: "Outra tarefa concluída",
        data: amanha,
        usuario: "Carlos",
        concluida: true,
        createdAt: new Date(),
        createdBy: "Sistema"
      }
    ]
  })
  
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

  // Usar hooks customizados para processar tarefas
  const { processedTarefas, groupHeaders } = useTaskGrouping(
    tarefas, 
    groupField, 
    showCompleted, 
    sortField, 
    sortDirection
  )

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
      groupHeaders
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