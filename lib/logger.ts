import { Axiom } from '@axiomhq/js'

const axiom = new Axiom({
  token: process.env.AXIOM_TOKEN!,
  orgId: process.env.AXIOM_ORG_ID,
})

const dataset = process.env.AXIOM_DATASET || 'thread-recruitment-webhook'

export const log = {
  info: (message: string, data?: Record<string, unknown>) => {
    axiom.ingest(dataset, [{ level: 'info', message, ...data, _time: new Date().toISOString() }])
  },
  warn: (message: string, data?: Record<string, unknown>) => {
    axiom.ingest(dataset, [{ level: 'warn', message, ...data, _time: new Date().toISOString() }])
  },
  error: (message: string, data?: Record<string, unknown>) => {
    axiom.ingest(dataset, [{ level: 'error', message, ...data, _time: new Date().toISOString() }])
  },
  flush: () => axiom.flush(),
}

export type Log = typeof log
