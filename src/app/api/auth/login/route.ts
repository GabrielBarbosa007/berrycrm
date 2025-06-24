import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validações básicas
    if (!email || !password) {
      return NextResponse.json(
        { message: "E-mail e senha são obrigatórios" },
        { status: 400 }
      )
    }

    // Simular verificação de credenciais
    if (email === "teste@exemplo.com" && password === "123456") {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 500))

      return NextResponse.json(
        { 
          message: "Login realizado com sucesso",
          user: {
            id: "1",
            email: "teste@exemplo.com",
            fullName: "Usuário Teste"
          },
          token: "mock-jwt-token"
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { message: "Credenciais inválidas" },
      { status: 401 }
    )
  } catch (error) {
    console.error("Erro no login:", error)
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    )
  }
} 