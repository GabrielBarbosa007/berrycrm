import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, ClipboardList } from "lucide-react"
import CriarTarefaInline from "./CriarTarefaInline"
import { useTarefas } from "@/context/TarefasContext"
import TarefaItem from "./TarefaItem"
import { Tarefa } from "@/types/task"
import SortDropdown from "./SortDropdown"
import GroupByDropdown from "./GroupByDropdown"
import GroupHeader from "./GroupHeader"
import TaskFilter from "./TaskFilter"
import { useTaskFiltering, TaskFilterState } from "@/hooks/use-task-filtering"
import { useTaskGrouping } from "@/hooks/use-task-grouping"

export default function Tarefas() {
  const [openCriarTarefa, setOpenCriarTarefa] = useState(false)
  const [tarefaSelecionada, setTarefaSelecionada] = useState<Tarefa | null>(null)
  
  // Estado dos filtros
  const [filter, setFilter] = useState<TaskFilterState>({
    title: "",
    assignee: "",
    dueStart: null,
    dueEnd: null,
    tags: [],
  })

  const { 
    tarefas,
    sortField,
    sortDirection,
    groupField,
    showCompleted,
    setSortField,
    setSortDirection,
    setGroupField,
    setShowCompleted
  } = useTarefas()

  // Lista de cessionários únicos
  const assignees = useMemo(() => {
    const set = new Set<string>()
    tarefas.forEach(t => t.usuario && set.add(t.usuario))
    return Array.from(set)
  }, [tarefas])

  // Aplicar filtros usando hook customizado
  const tarefasFiltradas = useTaskFiltering(tarefas, filter, showCompleted)

  // Processar tarefas filtradas usando hook customizado
  const { processedTarefas: tarefasProcessadas, groupHeaders: headersProcessados } = useTaskGrouping(
    tarefasFiltradas,
    groupField,
    showCompleted,
    sortField,
    sortDirection
  )

  return (
    <div className="flex flex-col h-full min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 py-6 px-8 border-b bg-background sticky top-0 z-10">
        <h1 className="text-2xl font-bold tracking-tight">Tarefas</h1>
        <div className="flex items-center gap-2">
          <GroupByDropdown
            groupField={groupField}
            showCompleted={showCompleted}
            onGroupFieldChange={setGroupField}
            onShowCompletedChange={setShowCompleted}
          />
          <Button
            variant="default"
            className="ml-2 flex items-center gap-2 px-6 py-2 text-lg font-medium rounded-xl shadow"
            onClick={() => setOpenCriarTarefa(true)}
          >
            <Plus className="size-5 mr-1" />
            Nova tarefa
          </Button>
        </div>
      </div>

      {/* Barra de ferramentas secundária */}
      <div className="flex items-center gap-2 px-8 py-4 bg-background border-b sticky top-[72px] z-10">
        <SortDropdown
          sortField={sortField}
          sortDirection={sortDirection}
          onSortFieldChange={setSortField}
          onSortDirectionChange={setSortDirection}
        />
        <TaskFilter
          value={filter}
          onChange={setFilter}
          assignees={assignees}
          onClear={() => setFilter({ title: "", assignee: "", dueStart: null, dueEnd: null, tags: [] })}
        />
      </div>

      {/* Criar/Editar tarefa inline */}
      {(openCriarTarefa || tarefaSelecionada) && (
        <CriarTarefaInline
          onClose={() => {
            setOpenCriarTarefa(false)
            setTarefaSelecionada(null)
          }}
          tarefaParaEditar={tarefaSelecionada}
        />
      )}

      {/* Lista de tarefas agrupadas */}
      <div className="flex-1 flex flex-col items-center justify-start py-8 w-full">
        <div className="w-full max-w-2xl">
          {headersProcessados.length === 0 ? (
            <Card className="flex flex-col items-center justify-center border-0 shadow-none bg-transparent p-0">
              <ClipboardList className="size-20 text-muted-foreground mb-6" />
              <h2 className="text-2xl font-semibold mb-2">Tarefas</h2>
              <p className="text-muted-foreground mb-6">Nenhuma tarefa ainda! Crie sua primeira tarefa para começar.</p>
              <Button
                variant="default"
                size="lg"
                className="flex items-center gap-2 px-6 py-2 text-lg font-medium rounded-xl shadow"
                onClick={() => setOpenCriarTarefa(true)}
              >
                <Plus className="size-5 mr-1" />
                Nova tarefa
              </Button>
            </Card>
          ) : (
            headersProcessados.map(header => (
              <div key={header.key}>
                <GroupHeader label={header.label} count={header.count} />
                {tarefasProcessadas[header.key].map(tarefa => (
                  <TarefaItem
                    key={tarefa.id}
                    tarefa={tarefa}
                    onEdit={() => setTarefaSelecionada(tarefa)}
                  />
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
} 