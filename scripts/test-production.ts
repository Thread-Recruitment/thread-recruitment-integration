/**
 * Test the production webhook to debug answer upsert
 */
import { requireEnv, TEST_JOB_ID, TEST_CANDIDATE } from './lib'

const PROD_URL = 'https://thread-recruitment-integration.vercel.app'
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

const payload = {
  tt_first_name: TEST_CANDIDATE.firstName,
  tt_last_name: TEST_CANDIDATE.lastName,
  tt_email: TEST_CANDIDATE.email,
  tt_phone: TEST_CANDIDATE.phone,
  tt_tags: 'ManyChat,production-test',

  // Use question IDs from the job
  tt_answer_3165763: 'Yes', // Do you have permanent work rights? (Boolean)
  tt_answer_3213708: 'Production Test Location', // Location (Text)
}

async function main() {
  requireEnv()

  if (!WEBHOOK_SECRET) {
    console.error('Missing WEBHOOK_SECRET in .env.local')
    process.exit(1)
  }

  const url = `${PROD_URL}/api/webhook/${WEBHOOK_SECRET}?job_id=${TEST_JOB_ID}`

  console.log('\n=== Production Webhook Test ===\n')
  console.log(`Email: ${payload.tt_email}`)
  console.log('\nSending request...\n')

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    console.log(`Status: ${response.status}`)
    console.log('Response:', JSON.stringify(data, null, 2))

    // Check the answers in the report
    if (data.report?.answers) {
      console.log('\n=== Answers Report ===')
      for (const answer of data.report.answers) {
        console.log(`  ${answer.field}: ${answer.status}`)
        if (answer.error) {
          console.log(`    Error: ${answer.error}`)
        }
      }
    }
  } catch (error) {
    console.error('\nRequest failed:', error)
    process.exit(1)
  }
}

main()
