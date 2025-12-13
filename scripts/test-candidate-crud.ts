import { requireEnv, getClient, TEST_CANDIDATE } from './lib'

async function main() {
  requireEnv()

  const teamtailor = getClient()
  let candidateId: string | null = null

  try {
    // Create candidate
    console.log('\nCreating test candidate...')
    console.log(`  Email: ${TEST_CANDIDATE.email}`)

    const candidate = await teamtailor.createCandidate(TEST_CANDIDATE)
    candidateId = candidate.id

    console.log(`\nCandidate created:`)
    console.log(`  ID: ${candidateId}`)
    console.log(`  Name: ${candidate.attributes['first-name']} ${candidate.attributes['last-name']}`)

    // Delete candidate
    console.log('\nDeleting test candidate...')
    await teamtailor.deleteCandidate(candidateId)

    console.log('\nCandidate deleted successfully')
    console.log('\nCRUD test passed!')
  } catch (error) {
    console.error('\nTest failed:', error)

    // Attempt cleanup if we created a candidate
    if (candidateId) {
      console.log('\nAttempting cleanup...')
      try {
        await teamtailor.deleteCandidate(candidateId)
        console.log('Cleanup successful')
      } catch {
        console.error('Cleanup failed - manual deletion required for candidate:', candidateId)
      }
    }

    process.exit(1)
  }
}

main()
