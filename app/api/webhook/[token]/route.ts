import { NextRequest, NextResponse } from 'next/server'
import { parseManyChatFields } from '@/lib/parse'
import { syncCandidate } from '@/lib/sync'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params

  // 1. Validate token
  if (token !== process.env.WEBHOOK_SECRET) {
    console.error('Unauthorized webhook attempt', { token_received: token })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Extract job_id
  const { searchParams } = new URL(request.url)
  const jobId = searchParams.get('job_id')

  if (!jobId) {
    console.error('Missing job_id in webhook request')
    return NextResponse.json({ error: 'Missing job_id' }, { status: 400 })
  }

  // 3. Parse body
  let body: Record<string, string>
  try {
    body = await request.json()
  } catch {
    console.error('Invalid JSON body')
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // 4. Parse ManyChat fields
  let fields
  try {
    fields = parseManyChatFields(body)
  } catch (error) {
    console.error('Failed to parse fields', {
      error: error instanceof Error ? error.message : error,
    })
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid fields' },
      { status: 400 }
    )
  }

  console.log('Webhook received', {
    job_id: jobId,
    email: fields.candidate.email,
    answer_count: fields.answers.length,
    custom_field_count: fields.customFields.length,
    has_notes: !!fields.notes,
  })

  // 5. Sync to TeamTailor
  const result = await syncCandidate(fields, jobId)

  // 6. Return result
  if (result.success) {
    console.log('Sync completed successfully', {
      candidate_id: result.candidateId,
      email: fields.candidate.email,
    })
    return NextResponse.json({
      success: true,
      candidate_id: result.candidateId,
    })
  } else {
    console.error('Sync failed', {
      error: result.error,
      email: fields.candidate.email,
    })
    return NextResponse.json(
      { success: false, error: result.error },
      { status: 500 }
    )
  }
}
