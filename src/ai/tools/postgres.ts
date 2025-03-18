import { tool } from "ai"
import z from "zod"
import { pg } from "../../drizzle/client"

export const PostgresTool = tool({
  description: `
    Realize uma consulta ao banco de dados postgres e responda a pergunta do usuario.

    Você não pode realizar outras operações além do SELECT no banco de dados.

    Tables:
    """
      CREATE TABLE "subscriptions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "name" text NOT NULL,
        "email" text NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        CONSTRAINT "subscriptions_email_unique" UNIQUE("email")
      );
    """

    Todas as operações devem retornar no maximo 50 registros
  `.trim(),
  parameters: z.object({
    query: z.string().describe('Query to be executed'),
    params: z.array(z.string()).optional().describe('Query parameters'),
  }),
  execute: async ({ query, params }) => {
    const result = await pg.unsafe(query, params)

    console.log({ query, params })

    if (result.length === 0) {
      return 'Subscriber not found'
    }

    return JSON.stringify(result)
  },
})