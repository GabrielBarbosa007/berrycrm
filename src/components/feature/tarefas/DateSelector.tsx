"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { CalendarDays, Search } from "lucide-react"

export function DateSelector({ value, onChange }: { value?: Date | null, onChange?: (date: Date | null) => void }) {
  const [internalDate, setInternalDate] = useState<Date | undefined>(new Date())
  const date = value !== undefined ? value || undefined : internalDate
  const setDate = (d: Date | undefined) => {
    if (onChange) onChange(d ?? null)
    else setInternalDate(d)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-2 h-8 text-sm border bg-white rounded-md shadow-sm"
        >
          <CalendarDays className="size-4" />
          {date ? format(date, "PPP") : "Today"}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[320px] p-0 rounded-2xl shadow-lg border border-gray-100 bg-white"
        style={{ minWidth: 320 }}
      >
        {/* Campo de busca textual com ícone de lupa */}
        <div className="relative p-3 pb-2 border-b flex items-center">
          <input
            type="text"
            placeholder="Next Tuesday..."
            className="w-full text-sm px-3 py-2 rounded-md border border-gray-200 outline-none bg-white placeholder:text-gray-400 pr-9 focus:ring-2 focus:ring-primary/10 transition-all"
          />
          <span className="absolute right-5 text-gray-400">
            <Search size={16} />
          </span>
        </div>

        {/* Calendário */}
        <div className="flex justify-center py-2">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-xl p-2"
            captionLayout="dropdown"
          />
        </div>

        {/* Ações rápidas alinhadas à esquerda */}
        <div className="px-3 pb-3 pt-1 border-t">
          <div className="flex gap-2 w-full flex-wrap">
            <Button
              variant="outline"
              size="sm"
              className="text-xs px-3 h-7 whitespace-nowrap border-gray-200 flex items-center gap-1"
              onClick={() => setDate(new Date())}
            >
              <CalendarDays size={14} /> Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs px-3 h-7 whitespace-nowrap border-gray-200 flex items-center gap-1"
              onClick={() => {
                const t = new Date()
                t.setDate(t.getDate() + 1)
                setDate(t)
              }}
            >
              <span className="inline-block rotate-90"><CalendarDays size={14} /></span> Tomorrow
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs px-3 h-7 whitespace-nowrap border-gray-200 flex items-center gap-1"
              onClick={() => {
                const t = new Date()
                t.setDate(t.getDate() + 7)
                setDate(t)
              }}
            >
              <span className="inline-block"><CalendarDays size={14} /></span> Next week
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs px-3 h-7 whitespace-nowrap border-gray-200 flex items-center gap-1"
              onClick={() => setDate(undefined)}
            >
              <span className="inline-block"><CalendarDays size={14} /></span> No date
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
