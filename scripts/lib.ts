import { config } from 'dotenv'
config({ path: '.env.local' })

import { TeamTailorClient } from '../lib/teamtailor/client'

// Lazy client initialization after env is loaded
let _client: TeamTailorClient | null = null
export function getClient(): TeamTailorClient {
  if (!_client) {
    _client = new TeamTailorClient(process.env.TEAMTAILOR_API_KEY || '')
  }
  return _client
}

// Validate environment
export function requireEnv() {
  if (!process.env.TEAMTAILOR_API_KEY) {
    console.error('Missing TEAMTAILOR_API_KEY in .env.local')
    process.exit(1)
  }
  console.log('Environment loaded')
}

// Test configuration - edit these values
export const TEST_JOB_ID = '123456' // Replace with a real job ID from your TeamTailor

// Test candidate data
export const TEST_CANDIDATE = {
  firstName: 'Test',
  lastName: 'Candidate',
  email: `test-${Date.now()}@example.com`, // Unique email to avoid merge
  phone: '+64211234567',
  tags: ['test', 'delete-me'],
}
