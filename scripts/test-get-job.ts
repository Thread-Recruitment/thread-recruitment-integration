import { requireEnv, teamtailor, TEST_JOB_ID } from './lib'

async function main() {
  requireEnv()

  console.log(`\nFetching job ${TEST_JOB_ID}...`)

  try {
    const job = await teamtailor.getJob(TEST_JOB_ID)
    console.log('\n✓ Job found:')
    console.log(`  ID: ${job.id}`)
    console.log(`  Title: ${job.attributes.title}`)
  } catch (error) {
    console.error('\n❌ Failed to fetch job:', error)
    process.exit(1)
  }
}

main()
