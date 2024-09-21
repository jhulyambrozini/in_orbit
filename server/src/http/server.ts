import fastify from 'fastify'
import { createGoal } from '../usecases/create-goal'

import z from 'zod'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { getWeekPendingGoals } from '../usecases/get-week-pending-goal'
import { createGoalCompletion } from '../usecases/create-goal-completion'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.post(
  '/goal',
  {
    schema: {
      body: z.object({
        title: z.string(),
        desiredWeeklyFrequency: z.number().int().min(1).max(7),
      }),
    },
  },
  async request => {
    const { title, desiredWeeklyFrequency } = request.body

    await createGoal({
      title,
      desiredWeeklyFrequency,
    })
  }
)

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

app.get('/pending-goals', async () => {
  const { pedingGoals } = await getWeekPendingGoals()

  return { pedingGoals }
})

app.listen({ port: 3333 }).then(() => console.log('Server running...'))
