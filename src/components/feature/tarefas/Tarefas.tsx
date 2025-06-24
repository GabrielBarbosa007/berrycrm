import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Card } from "@/components/ui/card"
import { Filter, Plus, ClipboardList } from "lucide-react"
import CriarTarefaInline from "./CriarTarefaInline"
import { useTarefas } from "@/context/TarefasContext"
import TarefaItem from "./TarefaItem"
import { Tarefa } from "@/context/TarefasContext"
import SortDropdown from "./SortDropdown"
import GroupByDropdown from "./GroupByDropdown"
import GroupHeader from "./GroupHeader"

export default function Tarefas() {
  const [openCriarTarefa, setOpenCriarTarefa] = useState(false)
  const [tarefaSelecionada, setTarefaSelecionada] = useState<Tarefa | null>(null)
  
  const { 
    processedTarefas, 
    groupHeaders,
    sortField,
    sortDirection,
    groupField,
    showCompleted,
    setSortField,
    setSortDirection,
    setGroupField,
    setShowCompleted
  } = useTarefas()

  return (
    <div className="flex flex-col h-full min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 py-6 px-8 border-b bg-white sticky top-0 z-10">
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
            style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none' }}
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
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 border border-dashed border-input bg-white text-muted-foreground">
              <Filter className="size-4" />
              <span>Filtro</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Filtrar tarefas</TooltipContent>
        </Tooltip>
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
          {groupHeaders.length === 0 ? (
            <Card className="flex flex-col items-center justify-center border-0 shadow-none bg-transparent p-0">
              <ClipboardList className="size-20 text-muted-foreground mb-6" />
              <h2 className="text-2xl font-semibold mb-2">Tarefas</h2>
              <p className="text-muted-foreground mb-6">Nenhuma tarefa ainda! Crie sua primeira tarefa para começar.</p>
              <Button
                variant="default"
                size="lg"
                className="flex items-center gap-2 px-6 py-2 text-lg font-medium rounded-xl shadow"
                style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none' }}
                onClick={() => setOpenCriarTarefa(true)}
              >
                <Plus className="size-5 mr-1" />
                Nova tarefa
              </Button>
            </Card>
          ) : (
            groupHeaders.map(header => (
              <div key={header.key}>
                <GroupHeader label={header.label} count={header.count} />
                {processedTarefas[header.key].map(tarefa => (
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