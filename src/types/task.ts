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

export interface TaskFilterState {
  title: string
  assignee: string
  dueStart: Date | null
  dueEnd: Date | null
  tags: string[]
}

export interface User {
  id: number
  name: string
  avatar: string // Pode ser inicial ou url
}

export interface GroupHeader {
  key: string
  label: string
  count: number
}

export interface ProcessedTarefas {
  [key: string]: Tarefa[]
} 