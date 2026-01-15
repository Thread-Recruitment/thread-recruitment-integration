import Link from 'next/link'

export default function FindingIdsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link
          href="/docs"
          className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <span>&larr;</span> Back to docs
        </Link>

        <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Finding Question IDs &amp; Custom Field Names
        </h1>
        <p className="mb-12 text-zinc-600 dark:text-zinc-400">
          How to find the IDs and API names you need to configure your webhook.
        </p>

        {/* Question IDs */}
        <Section title="Finding Screening Question IDs">
          <p className="mb-4">
            Question IDs are numeric identifiers for screening questions in TeamTailor.
            You&apos;ll use these with the <Code>tt_answer_</Code> prefix.
          </p>

          <h3 className="mb-3 mt-6 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Method 1: From the URL (Easiest)
          </h3>
          <ol className="list-inside list-decimal space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>Go to <strong>Settings &rarr; Recruitment &rarr; Questions</strong> in TeamTailor</li>
            <li>Click on the question you want to use</li>
            <li>
              Look at the URL in your browser:
              <CodeBlock>
                {`https://app.teamtailor.com/.../questions/3165763
                                                      ↑↑↑↑↑↑↑
                                                   Question ID`}
              </CodeBlock>
            </li>
            <li>
              Use this ID in your webhook field: <Code>tt_answer_3165763</Code>
            </li>
          </ol>

          <h3 className="mb-3 mt-6 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Method 2: Via the API
          </h3>
          <p className="mb-3 text-zinc-600 dark:text-zinc-400">
            Call the TeamTailor API to list all questions:
          </p>
          <CodeBlock>
            {`GET https://api.teamtailor.com/v1/questions

# Headers:
Authorization: Token token=YOUR_API_KEY
X-Api-Version: 20161108`}
          </CodeBlock>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            The response will include each question with its <Code>id</Code> field.
          </p>

          <h3 className="mb-3 mt-6 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Job-Specific Questions
          </h3>
          <p className="mb-3 text-zinc-600 dark:text-zinc-400">
            To see which questions are attached to a specific job:
          </p>
          <CodeBlock>
            {`GET https://api.teamtailor.com/v1/jobs/{job_id}/picked-questions`}
          </CodeBlock>

          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> Make sure the question is attached to the job you&apos;re applying
              candidates to, otherwise the answer won&apos;t appear on their application.
            </p>
          </div>
        </Section>

        {/* Custom Field API Names */}
        <Section title="Finding Custom Field API Names">
          <p className="mb-4">
            Custom fields use an <strong>API Name</strong> (a text string), not a numeric ID.
            You&apos;ll use these with the <Code>tt_custom_</Code> prefix.
          </p>

          <h3 className="mb-3 mt-6 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Method 1: From TeamTailor Settings (Easiest)
          </h3>
          <ol className="list-inside list-decimal space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>Go to <strong>Settings &rarr; Recruitment &rarr; Custom fields</strong></li>
            <li>Click on the custom field you want to use</li>
            <li>
              Find the <strong>&ldquo;API Name&rdquo;</strong> field in the settings
              <div className="mt-2 rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
                <p className="font-mono text-sm text-zinc-700 dark:text-zinc-300">
                  API Name: <strong>location</strong>
                </p>
              </div>
            </li>
            <li>
              Use this name in your webhook field: <Code>tt_custom_location</Code>
            </li>
          </ol>

          <h3 className="mb-3 mt-6 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Method 2: Via the API
          </h3>
          <p className="mb-3 text-zinc-600 dark:text-zinc-400">
            Call the TeamTailor API to list all custom fields:
          </p>
          <CodeBlock>
            {`GET https://api.teamtailor.com/v1/custom-fields

# Headers:
Authorization: Token token=YOUR_API_KEY
X-Api-Version: 20161108`}
          </CodeBlock>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            Look for the <Code>api-name</Code> attribute in each custom field object.
          </p>

          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Important:</strong> The API name is case-sensitive and may contain hyphens.
              For example, if the API name is <Code>based-location</Code>, use{' '}
              <Code>tt_custom_based-location</Code>.
            </p>
          </div>
        </Section>

        {/* Job IDs */}
        <Section title="Finding Job IDs">
          <p className="mb-4">
            The job ID determines which position the candidate is applied to.
            You&apos;ll use this in the webhook URL&apos;s <Code>job_id</Code> parameter.
          </p>

          <h3 className="mb-3 mt-6 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            From the URL
          </h3>
          <ol className="list-inside list-decimal space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>Go to <strong>Jobs</strong> in TeamTailor</li>
            <li>Click on the job you want candidates applied to</li>
            <li>
              Look at the URL:
              <CodeBlock>
                {`https://app.teamtailor.com/.../jobs/6998249
                                                   ↑↑↑↑↑↑↑
                                                   Job ID`}
              </CodeBlock>
            </li>
            <li>
              Use this in your webhook URL: <Code>?job_id=6998249</Code>
            </li>
          </ol>
        </Section>

        {/* Quick Reference */}
        <Section title="Quick Reference">
          <p className="mb-4">Here&apos;s a summary of the field formats:</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="py-2 pr-4 font-medium text-zinc-900 dark:text-zinc-100">Type</th>
                  <th className="py-2 pr-4 font-medium text-zinc-900 dark:text-zinc-100">Format</th>
                  <th className="py-2 pr-4 font-medium text-zinc-900 dark:text-zinc-100">Example</th>
                </tr>
              </thead>
              <tbody className="text-zinc-600 dark:text-zinc-400">
                <tr className="border-b border-zinc-100 dark:border-zinc-800/50">
                  <td className="py-2 pr-4">Screening Answer</td>
                  <td className="py-2 pr-4"><Code>tt_answer_[QUESTION_ID]</Code></td>
                  <td className="py-2 pr-4"><Code>tt_answer_3165763</Code></td>
                </tr>
                <tr className="border-b border-zinc-100 dark:border-zinc-800/50">
                  <td className="py-2 pr-4">Custom Field</td>
                  <td className="py-2 pr-4"><Code>tt_custom_[API_NAME]</Code></td>
                  <td className="py-2 pr-4"><Code>tt_custom_location</Code></td>
                </tr>
                <tr className="border-b border-zinc-100 dark:border-zinc-800/50">
                  <td className="py-2 pr-4">Job ID (URL param)</td>
                  <td className="py-2 pr-4"><Code>?job_id=[JOB_ID]</Code></td>
                  <td className="py-2 pr-4"><Code>?job_id=6998249</Code></td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        <div className="mt-12">
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            &larr; Back to main docs
          </Link>
        </div>

        <div className="mt-16 border-t border-zinc-200 pt-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
          Need help? Contact your administrator.
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
      <div className="text-zinc-600 dark:text-zinc-400">{children}</div>
    </section>
  )
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800">
      {children}
    </code>
  )
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="mt-2 overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100 dark:bg-zinc-800">
      <code>{children}</code>
    </pre>
  )
}
