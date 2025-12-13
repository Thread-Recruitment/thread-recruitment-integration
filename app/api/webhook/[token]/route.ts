import { NextRequest, NextResponse } from 'next/server'
import { Logger } from 'next-axiom'
import { parseManyChatFields } from '@/lib/parse'
import { syncCandidate } from '@/lib/sync'
import { rateLimit } from '@/lib/rate-limit'

// Helper for consistent error responses
function errorResponse(
  log: Logger,
  message: string,
  status: number,
  details?: Record<string, unknown>
) {
  log.error(message, details)
  log.flush()
  return NextResponse.json({ error: message }, { status })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const log = new Logger()
  const { token } = await params

  // 1. Validate token
  if (token !== process.env.WEBHOOK_SECRET) {
    return errorResponse(log, 'Unauthorized', 401, { token_received: token })
  }

  // 2. Rate limit by IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const { success: withinLimit, remaining } = rateLimit(ip)

  if (!withinLimit) {
    return errorResponse(log, 'Too many requests', 429, { ip })
  }

  // 3. Extract job_id
  const { searchParams } = new URL(request.url)
  const jobId = searchParams.get('job_id')

  if (!jobId) {
    return errorResponse(log, 'Missing job_id', 400)
  }

  // 4. Parse body
  let body: Record<string, string>
  try {
    body = await request.json()
  } catch {
    return errorResponse(log, 'Invalid JSON body', 400)
  }

  // 5. Parse ManyChat fields
  let fields
  try {
    fields = parseManyChatFields(body)
  } catch (error) {
    return errorResponse(log, error instanceof Error ? error.message : 'Invalid fields', 400)
  }

  log.info('Webhook received', {
    job_id: jobId,
    email: fields.candidate.email,
    answer_count: fields.answers.length,
    custom_field_count: fields.customFields.length,
    has_notes: !!fields.notes,
    rate_limit_remaining: remaining,
  })

  // 6. Sync to TeamTailor
  const result = await syncCandidate(fields, jobId, log)

  // 7. Return result
  await log.flush()

  if (result.success) {
    return NextResponse.json({
      success: true,
      candidate_id: result.candidateId,
    })
  }

  return NextResponse.json(
    { success: false, error: result.error },
    { status: 500 }
  )
}
