import { count, gte, lte, and, eq, sql } from 'drizzle-orm'
import { db } from '../db'
import { goals, goalsCompletions } from '../db/schema'
import dayjs from 'dayjs'

interface CreateGoaCompletionlRequest {
  goalsId: string
}

export async function createGoalCompletion({
  goalsId,
}: CreateGoaCompletionlRequest) {
  const firstDayOfWeek = dayjs().startOf('week').toDate()
  const lastDayOfWeek = dayjs().endOf('week').toDate()

  const goalCompletionCounts = db.$with('goal_completion_counts').as(
    db
      .select({
        goalId: goalsCompletions.goalsId,
        completionCount: count(goalsCompletions.id).as('completionCount'),
      })
      .from(goalsCompletions)
      .where(
        and(
          gte(goalsCompletions.createAt, firstDayOfWeek),
          lte(goalsCompletions.createAt, lastDayOfWeek),
          eq(goalsCompletions.id, goalsId)
        )
      )
      .groupBy(goalsCompletions.goalsId)
  )

  const result = await db
    .with(goalCompletionCounts)
    .select({
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      completionCount: sql`
          COALESCE(${goalCompletionCounts.completionCount}, 0)
        `.mapWith(Number),
    })
    .from(goals)
    .leftJoin(goalCompletionCounts, eq(goalCompletionCounts.goalId, goals.id))
    .where(eq(goals.id, goalsId))

  const { completionCount, desiredWeeklyFrequency } = result[0]

  if (completionCount >= desiredWeeklyFrequency) {
    throw new Error('Meta completada esta semana! ')
  }

  const insertResult = await db
    .insert(goalsCompletions)
    .values({ goalsId })
    .returning()

  const goalsCompletion = insertResult[0]

  return { goalsCompletion }
}
