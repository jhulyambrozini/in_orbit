import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { createGoalCompletion } from '../usecases/create-goal-completion'

export const createCompletionRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/goal-completions',
    {
      schema: {
        body: z.object({
          goalsId: z.string(),
        }),
      },
    },
    async request => {
      const { goalsId } = request.body

      await createGoalCompletion({ goalsId })
    }
  )
}
