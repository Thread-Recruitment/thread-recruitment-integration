import { requireEnv, getClient, TEST_JOB_ID } from './lib'

async function main() {
  requireEnv()

  const teamtailor = getClient()

  console.log(`\nFetching job ${TEST_JOB_ID}...`)

  try {
    const job = await teamtailor.getJob(TEST_JOB_ID)
    console.log('\nJob found:')
    console.log(`  ID: ${job.id}`)
    console.log(`  Title: ${job.attributes.title}`)
  } catch (error) {
    console.error('\nFailed to fetch job:', error)
    process.exit(1)
  }
}

main()
