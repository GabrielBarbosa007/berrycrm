import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarDays, User2, ExternalLink, X, CornerDownLeft } from "lucide-react"

export default function CriarTarefa({ open = true, onClose }: { open?: boolean; onClose?: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-xl w-full rounded-2xl p-0 shadow-xl border bg-white"
        style={{ boxShadow: "0 4px 32px 0 rgba(16,30,54,.08)" }}
      >
        {/* Topo */}
        <div className="flex items-center justify-between px-6 pt-5 pb-2 border-b">
          <div className="flex items-center gap-2">
            <Checkbox id="criar-tarefa" checked readOnly />
            <Label htmlFor="criar-tarefa" className="text-lg font-semibold cursor-pointer select-none">Criar tarefa</Label>
          </div>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-accent">
              <X className="size-5" />
            </Button>
          </DialogClose>
        </div>

        {/* Campo de texto */}
        <div className="px-6 pt-4 pb-2 border-b">
          <Textarea
            className="resize-none min-h-[56px] text-base bg-transparent border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
            placeholder="Envie uma nota de agradecimento para @Contato pelo almoço recente"
          />
        </div>

        {/* Rodapé */}
        <div className="flex flex-wrap items-center gap-2 px-6 py-3 border-b bg-white">
          <Button variant="ghost" size="sm" className="flex items-center gap-2 px-2 h-8">
            <CalendarDays className="size-4" />
            Hoje
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2 px-2 h-8">
            <User2 className="size-4" />
            Atribuído a você
          </Button>
          <Button variant="link" size="sm" className="flex items-center gap-1 px-2 h-8 text-muted-foreground">
            <ExternalLink className="size-4" />
            Adicionar registro
          </Button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <Switch id="crie-mais" />
            <Label htmlFor="crie-mais" className="text-muted-foreground text-sm cursor-pointer select-none">Crie mais</Label>
          </div>
          <Button variant="ghost" className="px-4 h-8 text-base">Cancelar <span className="ml-1 text-xs text-muted-foreground">ESC</span></Button>
          <Button
            type="submit"
            className="px-6 h-8 text-base font-semibold bg-[#2563eb] hover:bg-[#1d4fd7] text-white flex items-center gap-2"
          >
            Salvar <CornerDownLeft className="size-4 ml-1" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 