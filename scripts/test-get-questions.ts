import { requireEnv, teamtailor } from './lib'

async function main() {
  requireEnv()

  console.log('\nFetching questions...')

  try {
    const questions = await teamtailor.getQuestions()

    console.log(`\n✓ Found ${questions.length} questions:\n`)

    for (const q of questions) {
      console.log(`  [${q.id}] ${q.attributes.title} (${q.attributes['question-type']})`)
    }
  } catch (error) {
    console.error('\n❌ Failed to fetch questions:', error)
    process.exit(1)
  }
}

main()
