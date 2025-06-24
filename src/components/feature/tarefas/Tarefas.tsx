import React from "react"
import {
  Button,
} from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Card } from "@/components/ui/card"
// Se já existir o Switch, descomente a linha abaixo:
// import { Switch } from "@/components/ui/switch"
import { ClipboardList, SlidersHorizontal, Filter, ChevronDown, Settings2, CalendarDays, User2, CalendarPlus, ArrowUp01, ArrowDown01, Check, Plus } from "lucide-react"
import CriarTarefaInline from "./CriarTarefaInline"


const GROUP_FIELDS = [
  { label: "Data de vencimento", value: "due", icon: CalendarDays },
  { label: "Cessionário", value: "assignee", icon: User2 },
  { label: "Data de criação", value: "created", icon: CalendarPlus },
  { label: "Criado por", value: "createdBy", icon: User2 },
]
const ORDER_FIELDS = [
  { label: "Data de vencimento", value: "due", icon: CalendarDays },
  { label: "Cessionário", value: "assignee", icon: User2 },
  { label: "Data de criação", value: "created", icon: CalendarPlus },
]
const ORDER_DIRECTIONS = [
  { label: "Ascendente", value: "asc", icon: ArrowUp01 },
  { label: "Descendente", value: "desc", icon: ArrowDown01 },
]

export default function Tarefas() {
  // Placeholder visual para o Switch (remova quando o Switch real estiver disponível)
  const Switch: React.FC<{ checked?: boolean }> = (props) => (
    <span className="inline-block w-10 h-6 bg-muted rounded-full relative align-middle">
      <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform" style={{ transform: props.checked ? 'translateX(1.25rem)' : 'none' }} />
    </span>
  )

  // Estado visual apenas para simulação
  const [orderField, setOrderField] = React.useState("due")
  const [orderDirection, setOrderDirection] = React.useState("asc")
  const [groupField, setGroupField] = React.useState("due")
  const [showCompleted, setShowCompleted] = React.useState(true)
  const [openCriarTarefa, setOpenCriarTarefa] = React.useState(false)

  const selectedField = ORDER_FIELDS.find(f => f.value === orderField)
  const selectedDirection = ORDER_DIRECTIONS.find(d => d.value === orderDirection)

  return (
    <div className="flex flex-col h-full min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 py-6 px-8 border-b bg-white sticky top-0 z-10">
        <h1 className="text-2xl font-bold tracking-tight">Tarefas</h1>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Settings2 className="size-4" />
                <span>Configurações de exibição</span>
                <ChevronDown className="size-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 p-1">
              <DropdownMenuLabel className="text-xs text-muted-foreground px-2 pt-2 pb-1 cursor-default select-none">Agrupar por</DropdownMenuLabel>
              {GROUP_FIELDS.map(f => {
                const Icon = f.icon
                const selected = groupField === f.value
                return (
                  <DropdownMenuItem
                    key={f.value}
                    className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm font-normal ${selected ? 'bg-accent/60 text-foreground' : ''}`}
                    onClick={() => setGroupField(f.value)}
                  >
                    <Icon className="size-4" />
                    <span>{f.label}</span>
                    {selected && <Check className="size-4 ml-auto text-primary" />}
                  </DropdownMenuItem>
                )
              })}
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuCheckboxItem
                checked={showCompleted}
                onCheckedChange={setShowCompleted}
                className="flex items-center gap-2 px-2 py-2"
              >
                <Switch checked={showCompleted} />
                <span>Mostrar tarefas concluídas</span>
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

      {/* Barra de ferramentas secundária - refatorada para dropdown igual à imagem */}
      <div className="flex items-center gap-2 px-8 py-4 bg-background border-b sticky top-[72px] z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center border border-input rounded-md px-3 py-1.5 bg-white shadow-sm text-sm font-normal text-muted-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring/50 transition min-w-[270px] max-w-full truncate"
              style={{ fontWeight: 500 }}
            >
              <SlidersHorizontal className="size-4 mr-1 text-muted-foreground" />
              <span className="text-muted-foreground">Classificado por</span>
              <span className="mx-1 font-semibold text-foreground truncate">{selectedField?.label}</span>
              <span className="text-muted-foreground">{selectedDirection?.label}</span>
              <ChevronDown className="size-4 ml-1 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 p-1">
            {ORDER_FIELDS.map(f => {
              const Icon = f.icon
              return (
                <DropdownMenuItem
                  key={f.value}
                  className="flex items-center gap-2"
                  onClick={() => setOrderField(f.value)}
                >
                  <Icon className="size-4" />
                  <span>{f.label}</span>
                  {orderField === f.value && <Check className="size-4 ml-auto text-primary" />}
                </DropdownMenuItem>
              )
            })}
            <div className="my-1 h-px bg-border" />
            {ORDER_DIRECTIONS.map(d => {
              const Icon = d.icon
              return (
                <DropdownMenuItem
                  key={d.value}
                  className="flex items-center gap-2"
                  onClick={() => setOrderDirection(d.value)}
                >
                  <Icon className="size-4" />
                  <span>{d.label}</span>
                  {orderDirection === d.value && <Check className="size-4 ml-auto text-primary" />}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
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

      {/* Criar tarefa inline */}
      {openCriarTarefa && <CriarTarefaInline />}

      {/* Área central de estado vazio */}
      <div className="flex-1 flex flex-col items-center justify-center py-24">
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
      </div>
    </div>
  )
} 