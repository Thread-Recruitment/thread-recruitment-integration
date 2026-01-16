import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="flex flex-col items-center gap-8 p-8 text-center">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-green-500" />
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Thread Recruitment Integration
          </h1>
        </div>

        <p className="max-w-md text-zinc-600 dark:text-zinc-400">
          ManyChat → TeamTailor webhook service
        </p>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-lg font-medium text-zinc-900 dark:text-zinc-100">
            Webhook Endpoint
          </h2>
          <code className="block rounded bg-zinc-100 px-4 py-2 text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
            POST /api/webhook?job_id=123
          </code>
        </div>

        <Link
          href="/docs"
          className="rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          View Integration Guide
        </Link>

        <div className="text-sm text-zinc-500 dark:text-zinc-500">
          Status: Operational
        </div>
      </main>
    </div>
  )
}
