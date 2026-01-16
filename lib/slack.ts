import type { SyncReport, FieldResult } from '@/types'

const TEAMTAILOR_COMPANY_ID = process.env.TEAMTAILOR_COMPANY_ID || 'aw3alxwdbpk@eu'

function statusEmoji(status: string): string {
  switch (status) {
    case 'success':
    case 'updated':
    case 'already_exists':
      return ':white_check_mark:'
    case 'failed':
      return ':x:'
    case 'skipped':
      return ':fast_forward:'
    case 'not_found':
      return ':grey_question:'
    default:
      return ':grey_question:'
  }
}

function isSuccessStatus(status: string): boolean {
  return status === 'success' || status === 'updated' || status === 'already_exists'
}

function buildCandidateUrl(candidateId: string): string {
  return `https://app.teamtailor.com/companies/${TEAMTAILOR_COMPANY_ID}/candidates/${candidateId}`
}

function buildFieldBreakdown(
  label: string,
  emoji: string,
  fields: FieldResult[]
): object | null {
  if (fields.length === 0) return null

  const lines = fields.map((f) => {
    const icon = statusEmoji(f.status)
    const truncatedValue = f.value.length > 50 ? f.value.slice(0, 47) + '...' : f.value
    const errorSuffix = f.error ? ` _${f.error}_` : ''
    return `${icon} \`${f.field}\`: ${truncatedValue}${errorSuffix}`
  })

  return {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `${emoji} *${label}:*\n${lines.join('\n')}`,
    },
  }
}

export async function sendSlackNotification(
  report: SyncReport,
  requestId: string
): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  if (!webhookUrl) {
    console.warn('SLACK_WEBHOOK_URL not set - skipping Slack notification')
    return
  }

  const headerEmoji = report.success ? ':white_check_mark:' : ':x:'
  const headerText = report.success ? 'Candidate Synced' : 'Sync Failed'
  const color = report.success ? '#36a64f' : '#dc3545'

  // Calculate summary
  const answersSuccess = report.answers.filter((a) => isSuccessStatus(a.status)).length
  const customFieldsSuccess = report.customFields.filter((f) => isSuccessStatus(f.status)).length

  const totalOps =
    2 + // candidate + job application
    report.answers.length +
    report.customFields.length +
    (report.notes !== null ? 1 : 0)

  const successOps =
    (isSuccessStatus(report.candidate) ? 1 : 0) +
    (isSuccessStatus(report.jobApplication) ? 1 : 0) +
    answersSuccess +
    customFieldsSuccess +
    (report.notes !== null && isSuccessStatus(report.notes) ? 1 : 0)

  // Build status lines
  const statusLines = [
    `${statusEmoji(report.candidate)} Candidate: ${report.candidate}`,
    `${statusEmoji(report.jobApplication)} Job Application: ${report.jobApplication}`,
  ]

  if (report.answers.length > 0) {
    statusLines.push(
      `${answersSuccess === report.answers.length ? ':white_check_mark:' : ':warning:'} Answers: ${answersSuccess}/${report.answers.length}`
    )
  }

  if (report.customFields.length > 0) {
    statusLines.push(
      `${customFieldsSuccess === report.customFields.length ? ':white_check_mark:' : ':warning:'} Custom Fields: ${customFieldsSuccess}/${report.customFields.length}`
    )
  }

  if (report.notes !== null) {
    statusLines.push(`${statusEmoji(report.notes)} Notes: ${report.notes}`)
  }

  // Build blocks
  const blocks: object[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `${headerEmoji} ${headerText}`,
        emoji: true,
      },
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Email:*\n${report.email}`,
        },
        {
          type: 'mrkdwn',
          text: `*Candidate ID:*\n${report.candidateId || 'N/A'}`,
        },
        {
          type: 'mrkdwn',
          text: `*Job ID:*\n${report.jobId}`,
        },
        {
          type: 'mrkdwn',
          text: `*Request ID:*\n${requestId.slice(0, 8)}...`,
        },
      ],
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Summary: ${successOps}/${totalOps} operations succeeded*\n${statusLines.join('\n')}`,
      },
    },
  ]

  // Add field breakdowns if there are any answers or custom fields
  const answersBreakdown = buildFieldBreakdown('Answers', ':clipboard:', report.answers)
  const customFieldsBreakdown = buildFieldBreakdown('Custom Fields', ':label:', report.customFields)

  if (answersBreakdown || customFieldsBreakdown) {
    blocks.push({ type: 'divider' })
    if (answersBreakdown) blocks.push(answersBreakdown)
    if (customFieldsBreakdown) blocks.push(customFieldsBreakdown)
  }

  // Add error if present
  if (report.error) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `:rotating_light: *Error:* ${report.error}`,
      },
    })
  }

  // Add View in TeamTailor button if we have a candidate ID
  if (report.candidateId) {
    blocks.push({
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'View in TeamTailor',
            emoji: true,
          },
          url: buildCandidateUrl(report.candidateId),
          style: 'primary',
        },
      ],
    })
  }

  const payload = {
    attachments: [
      {
        color,
        blocks,
      },
    ],
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      console.error('Slack notification failed', {
        status: response.status,
        body: await response.text(),
      })
    }
  } catch (error) {
    console.error('Slack notification error', error)
  }
}
