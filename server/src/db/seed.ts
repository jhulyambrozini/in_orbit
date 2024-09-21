import dayjs from 'dayjs'
import { client, db } from '.'
import { goals, goalsCompletions } from './schema'

async function seed() {
  await db.delete(goalsCompletions)
  await db.delete(goals)

  const result = await db
    .insert(goals)
    .values([
      { title: 'acordar tarde', desiredWeeklyFrequency: 7 },
      { title: 'Me exercitar', desiredWeeklyFrequency: 2 },
      { title: 'Tomar água', desiredWeeklyFrequency: 20 },
    ])
    .returning()

  const startOfWeek = dayjs().startOf('week')

  await db.insert(goalsCompletions).values([
    { goalsId: result[0].id, createAt: startOfWeek.add(1, 'days').toDate() },
    { goalsId: result[1].id, createAt: startOfWeek.add(5, 'days').toDate() },
    { goalsId: result[2].id, createAt: startOfWeek.add(3, 'days').toDate() },
  ])
}

seed().finally(() => {
  client.end()
})
