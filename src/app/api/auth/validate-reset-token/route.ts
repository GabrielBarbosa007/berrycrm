import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json(
        { message: "Token não fornecido" },
        { status: 400 }
      )
    }

    // TODO: Implementar validação real do token
    // Por enquanto, simulamos a validação
    
    // 1. Verificar se o token existe no banco
    // 2. Verificar se o token não expirou
    // 3. Verificar se o token não foi usado
    
    // Simulação de delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Para demonstração, aceitamos qualquer token que tenha pelo menos 10 caracteres
    if (token.length < 10) {
      return NextResponse.json(
        { message: "Token inválido" },
        { status: 400 }
      )
    }

    // Simular que alguns tokens são inválidos (para teste)
    if (token === "invalid_token_example") {
      return NextResponse.json(
        { message: "Token inválido ou expirado" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: "Token válido" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Erro ao validar token:", error)
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    )
  }
} 