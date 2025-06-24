import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CalendarDays, User2, CornerUpRight, X, CornerDownLeft } from "lucide-react";

export default function CriarTarefaInline() {
  return (
    <div
      className="w-full max-w-[768px] mx-auto mt-6 rounded-2xl border bg-white px-6 pt-4 pb-3 shadow-[0_4px_32px_0_rgba(16,30,54,0.08)]"
      style={{ boxShadow: "0 4px 32px 0 rgba(16,30,54,0.08)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Checkbox id="create-task" />
          <Label htmlFor="create-task" className="text-lg font-semibold select-none cursor-pointer">Create Task</Label>
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground" aria-label="Fechar">
          <X className="size-5" />
        </Button>
      </div>
      {/* Textarea */}
      <Textarea
        className="resize-none border-0 shadow-none ring-0 focus-visible:ring-0 focus-visible:border-0 text-lg px-0 py-2 min-h-[44px] placeholder:text-muted-foreground placeholder:font-normal placeholder:text-[20px]"
        placeholder="Schedule a demo with @Contact"
      />
      {/* Footer */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="flex items-center gap-1 px-2 h-8 text-base font-normal">
            <CalendarDays className="size-4" />Today
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1 px-2 h-8 text-base font-normal">
            <User2 className="size-4" />Assigned to You
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1 px-2 h-8 text-base font-normal">
            <CornerUpRight className="size-4" />Add Record
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 mr-4">
            <Switch id="create-more" />
            <Label htmlFor="create-more" className="text-base font-normal cursor-pointer">Create more</Label>
          </div>
          <Button variant="ghost" className="h-9 px-4 text-base font-normal text-muted-foreground">Cancel <span className="ml-1 text-xs">ESC</span></Button>
          <Button
            className="h-9 px-5 text-base font-semibold bg-[#2563eb] hover:bg-[#1d4fd7] text-white flex items-center gap-2"
          >
            Save <CornerDownLeft className="size-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
} 