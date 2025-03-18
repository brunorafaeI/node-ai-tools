import { generateText } from "ai"
import { groqModel } from "../ai"
import { PostgresTool, RedisTool } from "../ai/tools"

interface AnswerUserMessageParams {
  message: string
}

export async function answerUserMessage({
  message,
}: AnswerUserMessageParams) {
  const { text } = await generateText({
    model: groqModel,
    prompt: message,
    maxSteps: 5,
    tools: {
      PostgresTool,
      RedisTool,
    },
    system: `
      Você é responsavel por responder as perguntas do usuario.

      Inclua na resposta somente o que for referente ao assunto da pergunta, sem outros detalhes.

      O retorno deve ser sempre no formato markdown.
    `.trim()
  })

  return { answer: text }
}
