import { requireEnv, getClient, TEST_JOB_ID } from './lib'
import { parseManyChatFields } from '../lib/parse'
import { syncCandidate } from '../lib/sync'
import { formatSyncReportText } from '../lib/report'

// Test payload simulating ManyChat webhook
const TEST_PAYLOAD = {
  tt_first_name: 'Integration',
  tt_last_name: 'Test',
  tt_email: `integration-test-${Date.now()}@example.com`,
  tt_phone: '+64211234567',
  tt_tags: 'test,delete-me',
  tt_notes: 'This is an automated integration test. Safe to delete.',
}

async function main() {
  requireEnv()

  const teamtailor = getClient()
  let candidateId: string | null = null

  try {
    console.log('\n=== Full Sync Integration Test ===\n')

    // Step 1: Parse fields
    console.log('1. Parsing ManyChat fields...')
    const fields = parseManyChatFields(TEST_PAYLOAD)
    console.log(`   Parsed: ${fields.candidate.email}`)

    // Step 2: Run sync
    console.log(`\n2. Syncing to TeamTailor (job_id: ${TEST_JOB_ID})...\n`)
    const report = await syncCandidate(fields, TEST_JOB_ID)

    // Display report
    console.log('--- Sync Report ---')
    console.log(formatSyncReportText(report))
    console.log('-------------------\n')

    if (!report.success) {
      throw new Error(`Sync failed: ${report.error}`)
    }

    candidateId = report.candidateId!
    console.log(`Sync completed! Candidate ID: ${candidateId}`)

    // Step 3: Cleanup
    console.log('\n3. Cleaning up...')
    await teamtailor.deleteCandidate(candidateId)
    console.log('   Test candidate deleted')

    console.log('\nFull sync test passed!\n')
  } catch (error) {
    console.error('\nTest failed:', error)

    // Attempt cleanup
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
