# 📋 API Documentation - BerryCRM Backend

## 🔐 Autenticação

### POST /auth/login
**Descrição**: Login do usuário
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Resposta**:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "Gabriel Barbosa",
    "email": "user@example.com",
    "avatar": "G"
  }
}
```

### GET /auth/me
**Descrição**: Obter dados do usuário atual
**Headers**: `Authorization: Bearer <token>`

**Resposta**:
```json
{
  "id": 1,
  "name": "Gabriel Barbosa",
  "email": "user@example.com",
  "avatar": "G"
}
```

## 📝 Tarefas

### GET /tasks
**Descrição**: Buscar todas as tarefas com filtros e ordenação
**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `groupBy`: `due` | `assignee` | `created` | `createdBy`
- `sortBy`: `due` | `assignee` | `created`
- `direction`: `asc` | `desc`
- `showCompleted`: `true` | `false`
- `title`: string (busca por título)
- `assignee`: string (filtrar por responsável)
- `dueStart`: ISO date string
- `dueEnd`: ISO date string
- `tags`: string[] (futuro)

**Exemplo**: `GET /tasks?groupBy=due&sortBy=due&direction=asc&showCompleted=true`

**Resposta**:
```json
{
  "tasks": [
    {
      "id": "1",
      "titulo": "Tarefa de hoje",
      "data": "2024-01-15T00:00:00.000Z",
      "usuario": "João",
      "concluida": false,
      "createdAt": "2024-01-15T10:00:00.000Z",
      "createdBy": "Gabriel Barbosa"
    }
  ],
  "groupedTasks": {
    "Hoje": [
      {
        "id": "1",
        "titulo": "Tarefa de hoje",
        "data": "2024-01-15T00:00:00.000Z",
        "usuario": "João",
        "concluida": false,
        "createdAt": "2024-01-15T10:00:00.000Z",
        "createdBy": "Gabriel Barbosa"
      }
    ]
  },
  "groupHeaders": [
    {
      "key": "Hoje",
      "label": "Hoje",
      "count": 1
    }
  ]
}
```

### POST /tasks
**Descrição**: Criar nova tarefa
**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "titulo": "Nova tarefa",
  "data": "2024-01-20T00:00:00.000Z",
  "usuario": "João"
}
```

**Resposta**:
```json
{
  "id": "2",
  "titulo": "Nova tarefa",
  "data": "2024-01-20T00:00:00.000Z",
  "usuario": "João",
  "concluida": false,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "createdBy": "Gabriel Barbosa"
}
```

### PATCH /tasks/:id
**Descrição**: Editar tarefa existente
**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "titulo": "Tarefa atualizada",
  "data": "2024-01-25T00:00:00.000Z",
  "usuario": "Maria"
}
```

**Resposta**: Tarefa atualizada

### DELETE /tasks/:id
**Descrição**: Excluir tarefa
**Headers**: `Authorization: Bearer <token>`

**Resposta**: `204 No Content`

### PATCH /tasks/:id/complete
**Descrição**: Marcar tarefa como concluída
**Headers**: `Authorization: Bearer <token>`

**Resposta**:
```json
{
  "id": "1",
  "titulo": "Tarefa de hoje",
  "data": "2024-01-15T00:00:00.000Z",
  "usuario": "João",
  "concluida": true,
  "createdAt": "2024-01-15T10:00:00.000Z",
  "createdBy": "Gabriel Barbosa"
}
```

### PATCH /tasks/:id/order
**Descrição**: Atualizar posição/ordem da tarefa (drag and drop)
**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "newPosition": 2,
  "groupId": "Hoje"
}
```

**Resposta**: Lista atualizada de tarefas no grupo

## 👥 Usuários

### GET /users
**Descrição**: Buscar usuários (para atribuição e filtros)
**Headers**: `Authorization: Bearer <token>`

**Resposta**:
```json
[
  {
    "id": 1,
    "name": "Gabriel Barbosa",
    "email": "gabriel@example.com",
    "avatar": "G"
  },
  {
    "id": 2,
    "name": "Maria Silva",
    "email": "maria@example.com",
    "avatar": "M"
  }
]
```

## 🗄️ Estruturas de Dados

### Task Model
```typescript
interface Task {
  id: string
  titulo: string
  data: Date | null
  usuario: string
  concluida: boolean
  createdAt: Date
  createdBy: string
  order?: number // Para drag and drop
  groupId?: string // Para agrupamento
}
```

### User Model
```typescript
interface User {
  id: number
  name: string
  email: string
  avatar: string
  createdAt: Date
  updatedAt: Date
}
```

### Filter State
```typescript
interface TaskFilterState {
  title: string
  assignee: string
  dueStart: Date | null
  dueEnd: Date | null
  tags: string[]
}
```

## 🔧 Middleware Necessário

### Auth Middleware
```typescript
// Verificar token JWT em todas as rotas protegidas
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' })
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' })
  }
}
```

### Error Handling
```typescript
// Middleware para tratamento de erros
const errorHandler = (err, req, res, next) => {
  console.error(err.stack)
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      error: 'Dados inválidos', 
      details: err.details 
    })
  }
  
  if (err.name === 'NotFoundError') {
    return res.status(404).json({ 
      error: 'Recurso não encontrado' 
    })
  }
  
  return res.status(500).json({ 
    error: 'Erro interno do servidor' 
  })
}
```

## 📊 Cache Strategy

### Redis Cache (Recomendado)
- Cache de tarefas por usuário: `tasks:user:{userId}`
- Cache de usuários: `users:list`
- TTL: 5 minutos para tarefas, 30 minutos para usuários

### Invalidation
- Invalidar cache de tarefas quando: criar, editar, excluir, completar
- Invalidar cache de usuários quando: atualizar perfil

## 🔒 Segurança

### Rate Limiting
```typescript
// Limitar requisições por IP
const rateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requisições por IP
})
```

### CORS
```typescript
// Configurar CORS para frontend
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))
```

### Input Validation
```typescript
// Usar biblioteca como Joi ou Zod para validação
const taskSchema = Joi.object({
  titulo: Joi.string().min(3).max(200).required(),
  data: Joi.date().allow(null),
  usuario: Joi.string().required()
})
```

## 🚀 Deploy Considerations

### Environment Variables
```env
JWT_SECRET=your_jwt_secret_here
DATABASE_URL=postgresql://user:pass@localhost:5432/berrycrm
REDIS_URL=redis://localhost:6379
FRONTEND_URL=http://localhost:3000
NODE_ENV=production
```

### Database Migrations
```sql
-- Tabela de tarefas
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(200) NOT NULL,
  data TIMESTAMP,
  usuario VARCHAR(100) NOT NULL,
  concluida BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(100) NOT NULL,
  order_index INTEGER DEFAULT 0,
  group_id VARCHAR(50)
);

-- Tabela de usuários
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  avatar VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_tasks_user ON tasks(usuario);
CREATE INDEX idx_tasks_concluida ON tasks(concluida);
CREATE INDEX idx_tasks_data ON tasks(data);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);
``` 