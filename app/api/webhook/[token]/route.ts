import { NextRequest, NextResponse } from 'next/server'
import { Logger } from 'next-axiom'
import { parseManyChatFields } from '@/lib/parse'
import { syncCandidate } from '@/lib/sync'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const log = new Logger()
  const { token } = await params

  // 1. Validate token
  if (token !== process.env.WEBHOOK_SECRET) {
    log.error('Unauthorized webhook attempt', { token_received: token })
    await log.flush()
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Extract job_id
  const { searchParams } = new URL(request.url)
  const jobId = searchParams.get('job_id')

  if (!jobId) {
    log.error('Missing job_id in webhook request')
    await log.flush()
    return NextResponse.json({ error: 'Missing job_id' }, { status: 400 })
  }

  // 3. Parse body
  let body: Record<string, string>
  try {
    body = await request.json()
  } catch {
    log.error('Invalid JSON body')
    await log.flush()
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // 4. Parse ManyChat fields
  let fields
  try {
    fields = parseManyChatFields(body)
  } catch (error) {
    log.error('Failed to parse fields', {
      error: error instanceof Error ? error.message : error,
    })
    await log.flush()
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid fields' },
      { status: 400 }
    )
  }

  log.info('Webhook received', {
    job_id: jobId,
    email: fields.candidate.email,
    answer_count: fields.answers.length,
    custom_field_count: fields.customFields.length,
    has_notes: !!fields.notes,
  })

  // 5. Sync to TeamTailor
  const result = await syncCandidate(fields, jobId, log)

  // 6. Return result
  if (result.success) {
    log.info('Sync completed successfully', {
      candidate_id: result.candidateId,
      email: fields.candidate.email,
    })
    await log.flush()
    return NextResponse.json({
      success: true,
      candidate_id: result.candidateId,
    })
  } else {
    log.error('Sync failed', {
      error: result.error,
      email: fields.candidate.email,
    })
    await log.flush()
    return NextResponse.json(
      { success: false, error: result.error },
      { status: 500 }
    )
  }
}
