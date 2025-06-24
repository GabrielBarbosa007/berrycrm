"use client"

import { createContext, useContext, useState } from "react"

export interface Tarefa {
  id: string
  titulo: string
  data: Date | null
  usuario: string
}

interface TarefasContextType {
  tarefas: Tarefa[]
  adicionarTarefa: (nova: Tarefa) => void
  editarTarefa: (tarefaEditada: Tarefa) => void
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

  return (
    <TarefasContext.Provider value={{ tarefas, adicionarTarefa, editarTarefa }}>
      {children}
    </TarefasContext.Provider>
  )
}

export const useTarefas = () => {
  const context = useContext(TarefasContext)
  if (!context) throw new Error("useTarefas deve estar dentro de TarefasProvider")
  return context
} 