import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const forgotPasswordSchema = z.object({
  email: z.string().email("E-mail inválido"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = forgotPasswordSchema.parse(body)

    // TODO: Implementar lógica real de envio de e-mail
    // Por enquanto, simulamos o envio
    
    // 1. Verificar se o e-mail existe na base de dados
    // 2. Gerar token único e temporário
    // 3. Salvar token no banco com expiração
    // 4. Enviar e-mail com link de redefinição
    
    // Simulação de delay para mostrar loading
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Log para debug (remover em produção)
    console.log(`Password reset requested for: ${email}`)

    // Sempre retornar sucesso para não revelar se o e-mail existe
    return NextResponse.json(
      { 
        message: "Se esse e-mail existir em nossa base de dados, você receberá um link de recuperação." 
      },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Dados inválidos", errors: error.errors },
        { status: 400 }
      )
    }

    console.error("Erro ao processar solicitação de recuperação de senha:", error)
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    )
  }
} 