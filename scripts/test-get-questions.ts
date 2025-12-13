import { requireEnv, getClient } from './lib'

async function main() {
  requireEnv()

  const teamtailor = getClient()

  console.log('\nFetching questions...')

  try {
    const questions = await teamtailor.getQuestions()

    console.log(`\nFound ${questions.length} questions:\n`)

    for (const q of questions) {
      console.log(`  [${q.id}] ${q.attributes.title} (${q.attributes['question-type']})`)
    }
  } catch (error) {
    console.error('\nFailed to fetch questions:', error)
    process.exit(1)
  }
}

main()
