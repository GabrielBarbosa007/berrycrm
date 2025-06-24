import React, { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { X, Search } from "lucide-react"

// Mock de usuários (substitua por fetch/api depois)
const MOCK_USERS = [
  { id: 1, name: "Gabriel Barbosa", avatar: "G" },
  { id: 2, name: "Maria Silva", avatar: "M" },
  { id: 3, name: "João Souza", avatar: "J" },
  { id: 4, name: "Ana Costa", avatar: "A" },
]

export type User = {
  id: number
  name: string
  avatar: string // Pode ser inicial ou url
}

type AssignedUsersSelectorProps = {
  value: User[]
  onChange: (users: User[]) => void
  placeholder?: string
}

export function AssignedUsersSelector({ value, onChange, placeholder = "Find a user..." }: AssignedUsersSelectorProps) {
  const [search, setSearch] = useState("")

  // Filtra usuários que não estão selecionados e batem com a busca
  const filteredUsers = useMemo(() => {
    const lower = search.toLowerCase()
    return MOCK_USERS.filter(
      u => !value.some(sel => sel.id === u.id) && u.name.toLowerCase().includes(lower)
    )
  }, [search, value])

  // Remove usuário
  const removeUser = (id: number) => {
    onChange(value.filter(u => u.id !== id))
  }

  // Adiciona usuário
  const addUser = (user: User) => {
    onChange([...value, user])
    setSearch("")
  }

  return (
    <div className="w-full min-w-[320px] bg-popover rounded-xl shadow-lg border p-3">
      {/* Input de busca + chips */}
      <div className="flex flex-wrap gap-2 items-center mb-2">
        {value.map(user => (
          <span key={user.id} className="flex items-center bg-accent text-accent-foreground rounded-full px-2 py-1 text-sm font-medium mr-1">
            <Avatar className="w-5 h-5 text-xs mr-1 bg-primary text-primary-foreground">{user.avatar}</Avatar>
            {user.name}
            <button
              className="ml-1 text-muted-foreground hover:text-foreground focus:outline-none"
              onClick={() => removeUser(user.id)}
              aria-label={`Remove ${user.name}`}
              type="button"
            >
              <X size={16} />
            </button>
          </span>
        ))}
        <div className="relative flex-1 min-w-[120px]">
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={placeholder}
            className="pl-8 h-8 text-sm"
          />
          <span className="absolute left-2 top-1.5 text-muted-foreground">
            <Search size={16} />
          </span>
        </div>
      </div>
      {/* Lista de resultados */}
      <div className="max-h-40 overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">No users</div>
        ) : (
          filteredUsers.map(user => (
            <Button
              key={user.id}
              variant="ghost"
              className="w-full flex items-center justify-start gap-2 px-2 py-2 text-sm rounded-md"
              onClick={() => addUser(user)}
            >
              <Avatar className="w-6 h-6 text-sm bg-primary text-primary-foreground">{user.avatar}</Avatar>
              {user.name}
            </Button>
          ))
        )}
      </div>
    </div>
  )
} 