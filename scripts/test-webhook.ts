import { requireEnv, TEST_JOB_ID, TEST_CANDIDATE } from './lib'

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000'
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

// Job 6998249 - Test Job - Manychat Integration
// Screening Questions:
//   [3522414] If no, what is your work visa situation right now? (Text)
//   [3213708] Location (Text)
//   [3165763] Do you have permanent work rights? (Boolean)
//   [3522439] Salary Expectations (Text)

// Custom Fields:
//   location (Text)
//   video-interview (URL)
//   websiteportfolio (URL)
//   based-location (Text)
//   visa-sponsorship-required (Checkbox)
//   additional-notes (Text)

const payload = {
  // Candidate info from lib.ts
  tt_first_name: TEST_CANDIDATE.firstName,
  tt_last_name: TEST_CANDIDATE.lastName,
  tt_email: TEST_CANDIDATE.email,
  tt_phone: TEST_CANDIDATE.phone,
  tt_tags: TEST_CANDIDATE.tags.join(',') + ',ManyChat,test-webhook', // Extra tags

  // Screening answers for job 6998249
  tt_answer_3165763: 'Yes', // Do you have permanent work rights? (Boolean)
  tt_answer_3213708: 'Auckland, New Zealand', // Location (Text)
  tt_answer_3522414: 'N/A - I have permanent work rights', // If no, what is your work visa situation? (Text)
  tt_answer_3522439: '$80,000 - $100,000', // Salary Expectations (Text)

  // Invalid answer ID - should fail gracefully
  tt_answer_9999999: 'This question does not exist', // Should report as failed/not_found

  // Custom fields (candidate profile) - testing all types
  tt_custom_location: 'Auckland', // Text
  'tt_custom_based-location': 'New Zealand', // Text
  'tt_custom_video-interview': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // URL
  tt_custom_websiteportfolio: 'https://example.com/portfolio', // URL
  'tt_custom_visa-sponsorship-required': 'no', // Checkbox - will convert to false
  'tt_custom_additional-notes': 'Test candidate from ManyChat webhook test script', // Text

  // Invalid custom field - should fail gracefully
  'tt_custom_nonexistent-field': 'This field does not exist', // Should report as not_found

  // Notes
  tt_notes: `**ManyChat Webhook Test**

- Submitted via test-webhook.ts
- Testing all field types

**Answers:**
- Boolean: Yes
- Text: Auckland, New Zealand
- Invalid ID: Should fail

**Custom Fields:**
- Text fields: location, based-location, additional-notes
- URL fields: video-interview, websiteportfolio
- Checkbox: visa-sponsorship-required
- Invalid field: Should fail`,
}

async function main() {
  requireEnv()

  if (!WEBHOOK_SECRET) {
    console.error('Missing WEBHOOK_SECRET in .env.local')
    process.exit(1)
  }

  const url = `${BASE_URL}/api/webhook/${WEBHOOK_SECRET}?job_id=${TEST_JOB_ID}`

  console.log('\n=== ManyChat Webhook Test ===\n')
  console.log(`Job ID: ${TEST_JOB_ID}`)
  console.log(`URL: ${BASE_URL}/api/webhook/[secret]?job_id=${TEST_JOB_ID}`)
  console.log(`Email: ${payload.tt_email}`)
  console.log('')
  console.log('Payload:')
  console.log(JSON.stringify(payload, null, 2))
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
      console.log('\n✓ Webhook test passed!')
      console.log(`  Candidate ID: ${data.candidate_id}`)
      console.log(`  Request ID: ${data.request_id}`)
      console.log('\nNote: Delete this test candidate manually in TeamTailor')
    } else {
      console.error('\n✗ Webhook test failed')
      process.exit(1)
    }
  } catch (error) {
    console.error('\nRequest failed:', error)
    console.error('\nMake sure the dev server is running: npm run dev')
    process.exit(1)
  }
}

main()
