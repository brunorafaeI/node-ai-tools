import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { answerUserMessage } from '../functions/answer-user-message'

export const sendMessageRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/messages',
    {
      schema: {
        summary: 'Send a message to the AI chat',
        operationId: 'sendMessage',
        tags: ['ai', 'chat', 'messages'],
        body: z.object({
          message: z.string(),
        }),
        response: {
          200: z.object({
            answer: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { message } = request.body
      const { answer } = await answerUserMessage({ message })

      return { answer }
    }
  )
}
