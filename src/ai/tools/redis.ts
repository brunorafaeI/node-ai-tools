import { tool } from "ai"
import z from "zod"
import { redis } from "../../redis/client"

export const RedisTool = tool({
  description: `
    Realize um comando no Redis para buscar informações sobre o sistema de indicações, como:

      - Quantidade de convites

      - Quantidade de clicks

      - Ranking de convites

      - Ranking de clicks

    Você não pode realizar outras operações além do SELECT no banco de dados.

    Você pode buscar dados de:

      - Um hash chamado "referral:access-count" que guarda o numero de clicks no link convite/indicação de cada usuario no formato: 

        { SUBSCRIBER_ID: NUMBER_OF_CLICKS } onde o SUBSCRIBER_ID é a referência do ID do usuario no banco de dados Postgres.

      - Um zset chamado "referral:ranking" que guarda o total de convites/indicações feitos por cada usuario. O score é a quantidade de convites e o conteudo é o ID do usuario.

  `.trim(),
  parameters: z.object({
    command: z.string().describe("Command to be executed like: GET, HGET, ZREVRANGE, etc"),
    args: z.array(z.string()).describe("Command arguments"),
  }),
  execute: async ({ command, args }) => {
    const result = await redis.call(command, args)

    console.log({ command, args })

    if (!result) {
      return 'Subscriber not found'
    }

    return JSON.stringify(result)
  },
})