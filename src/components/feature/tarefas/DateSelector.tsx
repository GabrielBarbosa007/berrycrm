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
import { CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"

export function DateSelector() {
  const [date, setDate] = useState<Date | null>(new Date())

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

      <PopoverContent className="w-[280px] p-0 rounded-xl shadow-lg">
        {/* Campo de busca textual (fake) */}
        <div className="p-2 border-b">
          <input
            type="text"
            placeholder="Next Tuesday..."
            className="w-full text-sm px-2 py-1.5 rounded-md border outline-none bg-white placeholder:text-muted-foreground"
          />
        </div>

        {/* Calendário */}
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md p-2"
        />

        {/* Ações rápidas com scroll horizontal */}
        <div className="overflow-x-auto px-2 pb-2 pt-1 border-t">
          <div className="flex gap-2 w-max pr-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs px-3 h-7 whitespace-nowrap"
              onClick={() => setDate(new Date())}
            >
              📅 Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs px-3 h-7 whitespace-nowrap"
              onClick={() => {
                const t = new Date()
                t.setDate(t.getDate() + 1)
                setDate(t)
              }}
            >
              🔁 Tomorrow
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs px-3 h-7 whitespace-nowrap"
              onClick={() => {
                const t = new Date()
                t.setDate(t.getDate() + 7)
                setDate(t)
              }}
            >
              ⏭️ Next week
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs px-3 h-7 text-red-500 border-red-200 whitespace-nowrap"
              onClick={() => setDate(null)}
            >
              🚫 No date
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
