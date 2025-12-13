import { config } from 'dotenv'
config({ path: '.env.local' })

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000'
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET
const TEST_JOB_ID = process.env.TEST_JOB_ID || '123456'

// Simulated ManyChat payload
const payload = {
  tt_first_name: 'ManyChat',
  tt_last_name: 'Test',
  tt_email: `manychat-test-${Date.now()}@example.com`,
  tt_phone: '+64211234567',
  tt_tags: 'ManyChat,test,delete-me',
  tt_notes: 'Simulated ManyChat webhook test',
}

async function main() {
  if (!WEBHOOK_SECRET) {
    console.error('Missing WEBHOOK_SECRET in .env.local')
    process.exit(1)
  }

  const url = `${BASE_URL}/api/webhook/${WEBHOOK_SECRET}?job_id=${TEST_JOB_ID}`

  console.log('\n=== Simulated ManyChat Webhook Test ===\n')
  console.log(`URL: ${BASE_URL}/api/webhook/[secret]?job_id=${TEST_JOB_ID}`)
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

    if (response.ok && data.success) {
      console.log('\nWebhook test passed!')
      console.log(`Candidate created: ${data.candidate_id}`)
      console.log('\nNote: Delete this test candidate manually in TeamTailor')
    } else {
      console.error('\nWebhook test failed')
      process.exit(1)
    }
  } catch (error) {
    console.error('\nRequest failed:', error)
    console.error('\nMake sure the dev server is running: npm run dev')
    process.exit(1)
  }
}

main()
