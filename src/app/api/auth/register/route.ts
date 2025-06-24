import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, email, password } = body

    // Validações básicas
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { message: "Todos os campos são obrigatórios" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Senha deve ter pelo menos 6 caracteres" },
        { status: 400 }
      )
    }

    // Simular verificação se email já existe
    if (email === "teste@exemplo.com") {
      return NextResponse.json(
        { message: "E-mail já está em uso" },
        { status: 409 }
      )
    }

    // Simular criação do usuário
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      fullName,
      email,
      createdAt: new Date().toISOString(),
    }

    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 500))

    return NextResponse.json(
      { 
        message: "Usuário criado com sucesso",
        user 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Erro no registro:", error)
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    )
  }
} 