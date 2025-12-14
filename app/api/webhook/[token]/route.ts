import { NextRequest, NextResponse } from 'next/server'
import { log } from '@/lib/logger'
import { parseManyChatFields } from '@/lib/parse'
import { syncCandidate } from '@/lib/sync'
import { rateLimit } from '@/lib/rate-limit'
import { formatSyncReportText, formatSyncReportJson } from '@/lib/report'
import { sendSlackNotification } from '@/lib/slack'

// Helper for consistent error responses
function errorResponse(
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
  // Generate request ID for tracing
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID()
  const { token } = await params

  // 1. Validate token
  if (token !== process.env.WEBHOOK_SECRET) {
    return errorResponse('Unauthorized', 401, { request_id: requestId, token_received: token })
  }

  // 2. Rate limit by IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const { success: withinLimit, remaining } = rateLimit(ip)

  if (!withinLimit) {
    return errorResponse('Too many requests', 429, { request_id: requestId, ip })
  }

  // 3. Extract job_id
  const { searchParams } = new URL(request.url)
  const jobId = searchParams.get('job_id')

  if (!jobId) {
    return errorResponse('Missing job_id', 400, { request_id: requestId })
  }

  // 4. Parse body
  let body: Record<string, string>
  try {
    body = await request.json()
  } catch {
    return errorResponse('Invalid JSON body', 400, { request_id: requestId })
  }

  // 5. Parse ManyChat fields
  let fields
  try {
    fields = parseManyChatFields(body)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Invalid fields', 400, { request_id: requestId })
  }

  log.info('Webhook received', {
    request_id: requestId,
    job_id: jobId,
    email: fields.candidate.email,
    answer_count: fields.answers.length,
    custom_field_count: fields.customFields.length,
    has_notes: !!fields.notes,
    rate_limit_remaining: remaining,
  })

  // 6. Sync to TeamTailor
  const report = await syncCandidate(fields, jobId)

  // 7. Send Slack notification (fire-and-forget)
  sendSlackNotification(report, requestId).catch((err) =>
    console.error('Failed to send Slack notification', err)
  )

  // 8. Log sync report
  const reportJson = formatSyncReportJson(report)
  log.info('Sync report', {
    request_id: requestId,
    report: reportJson,
  })

  // Log text report for readability
  const reportText = formatSyncReportText(report)
  console.log(`\n--- Sync Report [${requestId}] ---\n${reportText}\n---\n`)

  // 9. Return result
  await log.flush()

  if (report.success) {
    return NextResponse.json({
      success: true,
      candidate_id: report.candidateId,
      request_id: requestId,
      report: reportJson,
    })
  }

  return NextResponse.json(
    { success: false, error: report.error, request_id: requestId, report: reportJson },
    { status: 500 }
  )
}
