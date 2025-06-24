import { Tarefa } from "@/types/task"

export interface ValidationError {
  field: string
  message: string
}

export function validateTarefa(tarefa: Partial<Tarefa>): ValidationError[] {
  const errors: ValidationError[] = []

  // Validar título
  if (!tarefa.titulo || tarefa.titulo.trim().length === 0) {
    errors.push({ field: "titulo", message: "Título é obrigatório" })
  } else if (tarefa.titulo.trim().length < 3) {
    errors.push({ field: "titulo", message: "Título deve ter pelo menos 3 caracteres" })
  }

  // Validar data
  if (tarefa.data && isNaN(tarefa.data.getTime())) {
    errors.push({ field: "data", message: "Data inválida" })
  }

  // Validar usuário
  if (!tarefa.usuario || tarefa.usuario.trim().length === 0) {
    errors.push({ field: "usuario", message: "Usuário é obrigatório" })
  }

  return errors
}

export function validateTarefaForCreation(tarefa: Partial<Tarefa>): ValidationError[] {
  const errors = validateTarefa(tarefa)
  
  // Validações específicas para criação
  if (!tarefa.id) {
    errors.push({ field: "id", message: "ID é obrigatório" })
  }

  return errors
}

export function validateTarefaForUpdate(tarefa: Partial<Tarefa>): ValidationError[] {
  const errors = validateTarefa(tarefa)
  
  // Validações específicas para atualização
  if (!tarefa.id) {
    errors.push({ field: "id", message: "ID é obrigatório para atualização" })
  }

  return errors
} 