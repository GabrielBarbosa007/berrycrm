"use client"

import { createContext, useContext, useState } from "react"

export interface Tarefa {
  id: string
  titulo: string
  data: Date | null
  usuario: string
  concluida?: boolean
}

interface TarefasContextType {
  tarefas: Tarefa[]
  adicionarTarefa: (nova: Tarefa) => void
  editarTarefa: (tarefaEditada: Tarefa) => void
  removerTarefa: (id: string) => void
  handleCompleteTask: (id: string) => Promise<void>
}

const TarefasContext = createContext<TarefasContextType | undefined>(undefined)

export const TarefasProvider = ({ children }: { children: React.ReactNode }) => {
  const [tarefas, setTarefas] = useState<Tarefa[]>([])

  const adicionarTarefa = (nova: Tarefa) => {
    setTarefas(prev => [...prev, nova])
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

  return (
    <TarefasContext.Provider value={{ tarefas, adicionarTarefa, editarTarefa, removerTarefa, handleCompleteTask }}>
      {children}
    </TarefasContext.Provider>
  )
}

export const useTarefas = () => {
  const context = useContext(TarefasContext)
  if (!context) throw new Error("useTarefas deve estar dentro de TarefasProvider")
  return context
} 