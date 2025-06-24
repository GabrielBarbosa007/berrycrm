import React from "react"

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white shadow rounded-xl p-6 flex flex-col items-start">
          <span className="text-sm text-muted-foreground">Usuários</span>
          <span className="text-2xl font-bold mt-2">1.245</span>
        </div>
        <div className="bg-white shadow rounded-xl p-6 flex flex-col items-start">
          <span className="text-sm text-muted-foreground">Vendas</span>
          <span className="text-2xl font-bold mt-2">R$ 18.400</span>
        </div>
        <div className="bg-white shadow rounded-xl p-6 flex flex-col items-start">
          <span className="text-sm text-muted-foreground">Atendimentos</span>
          <span className="text-2xl font-bold mt-2">320</span>
        </div>
      </div>
      <div className="bg-white shadow rounded-xl p-6 flex-1 min-h-[300px] mt-4">
        <span className="text-lg font-semibold">Resumo Geral</span>
        <div className="mt-2 text-muted-foreground">Gráficos ou informações adicionais podem ser exibidos aqui.</div>
      </div>
    </div>
  )
} 