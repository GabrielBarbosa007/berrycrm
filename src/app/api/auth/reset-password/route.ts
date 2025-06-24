import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token é obrigatório"),
  password: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, "Senha deve conter letras e números"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password } = resetPasswordSchema.parse(body)

    // TODO: Implementar lógica real de redefinição de senha
    // Por enquanto, simulamos o processo
    
    // 1. Validar o token novamente
    // 2. Verificar se o token não expirou
    // 3. Buscar usuário pelo token
    // 4. Atualizar a senha do usuário
    // 5. Invalidar o token (marcar como usado)
    
    // Simulação de delay
    await new Promise(resolve => setTimeout(resolve, 1000))

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

    // Simular erro de senha fraca (para teste)
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Senha deve ter pelo menos 6 caracteres" },
        { status: 400 }
      )
    }

    // Simular sucesso na redefinição
    return NextResponse.json(
      { message: "Senha atualizada com sucesso" },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Dados inválidos", errors: error.errors },
        { status: 400 }
      )
    }

    console.error("Erro ao redefinir senha:", error)
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    )
  }
} 