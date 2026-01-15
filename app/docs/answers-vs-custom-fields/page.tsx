import Link from 'next/link'

export default function AnswersVsCustomFieldsPage() {
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
          Answers vs Custom Fields
        </h1>
        <p className="mb-12 text-zinc-600 dark:text-zinc-400">
          Understanding the difference between screening answers and custom fields in TeamTailor.
        </p>

        {/* Overview */}
        <Section title="The Key Difference">
          <p className="mb-6">
            TeamTailor has two ways to store extra data about candidates. Choosing the right one
            depends on whether the data is specific to a job application or applies to the candidate globally.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                Answers (<Code>tt_answer_</Code>)
              </h4>
              <p className="mt-2 text-sm text-blue-800 dark:text-blue-200">
                Responses to <strong>job-specific screening questions</strong>.
              </p>
              <ul className="mt-2 list-inside list-disc text-sm text-blue-700 dark:text-blue-300">
                <li>Appear on the candidate&apos;s application for that job</li>
                <li>Set up per-job in TeamTailor&apos;s job settings</li>
                <li>Each job can have different questions</li>
              </ul>
            </div>

            <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-900 dark:bg-purple-950">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100">
                Custom Fields (<Code>tt_custom_</Code>)
              </h4>
              <p className="mt-2 text-sm text-purple-800 dark:text-purple-200">
                Extra data on the <strong>candidate profile itself</strong>.
              </p>
              <ul className="mt-2 list-inside list-disc text-sm text-purple-700 dark:text-purple-300">
                <li>Visible across all jobs the candidate applies to</li>
                <li>Set up globally in TeamTailor settings</li>
                <li>Same fields available for all candidates</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-100 p-4 dark:border-zinc-700 dark:bg-zinc-800">
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              <strong>In short:</strong> Answers are per-application (job-specific), Custom Fields are per-candidate (global).
            </p>
          </div>
        </Section>

        {/* When to Use Answers */}
        <Section title="When to Use Answers">
          <p className="mb-4">
            Use <Code>tt_answer_QUESTION_ID</Code> when:
          </p>
          <ul className="list-inside list-disc space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>The question is specific to a particular job role</li>
            <li>You want the response to appear on the job application in TeamTailor</li>
            <li>Different jobs need different questions</li>
            <li>You&apos;re collecting screening information for recruiters to review per-application</li>
          </ul>

          <h3 className="mb-3 mt-6 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Examples
          </h3>
          <ul className="list-inside list-disc space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>&ldquo;Do you have permanent work rights in New Zealand?&rdquo;</li>
            <li>&ldquo;What are your salary expectations for this role?&rdquo;</li>
            <li>&ldquo;How many years of experience do you have with React?&rdquo;</li>
            <li>&ldquo;Are you available to start within 2 weeks?&rdquo;</li>
          </ul>

          <h3 className="mb-3 mt-6 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            How to Set Up in TeamTailor
          </h3>
          <ol className="list-inside list-decimal space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>Go to the job in TeamTailor</li>
            <li>Click <strong>Settings</strong> → <strong>Application form</strong></li>
            <li>Add your screening questions</li>
            <li>Note the question ID from the URL when editing</li>
          </ol>
        </Section>

        {/* When to Use Custom Fields */}
        <Section title="When to Use Custom Fields">
          <p className="mb-4">
            Use <Code>tt_custom_API_NAME</Code> when:
          </p>
          <ul className="list-inside list-disc space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>The data applies to the candidate regardless of which job they apply for</li>
            <li>You want to track information across multiple applications</li>
            <li>You&apos;re storing metadata about where/how the candidate came from</li>
            <li>You need to filter or search candidates by this data globally</li>
          </ul>

          <h3 className="mb-3 mt-6 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Examples
          </h3>
          <ul className="list-inside list-disc space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>&ldquo;Traffic source&rdquo; (Instagram, LinkedIn, Referral, etc.)</li>
            <li>&ldquo;Region&rdquo; or &ldquo;Location&rdquo;</li>
            <li>&ldquo;Portfolio URL&rdquo; or &ldquo;LinkedIn profile&rdquo;</li>
            <li>&ldquo;Visa sponsorship required&rdquo; (yes/no)</li>
            <li>&ldquo;ManyChat subscriber ID&rdquo;</li>
          </ul>

          <h3 className="mb-3 mt-6 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            How to Set Up in TeamTailor
          </h3>
          <ol className="list-inside list-decimal space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>Go to <strong>Settings</strong> → <strong>Recruitment</strong> → <strong>Custom fields</strong></li>
            <li>Click <strong>+ Add custom field</strong></li>
            <li>Choose the field type (Text, Checkbox, URL, etc.)</li>
            <li>Set the <strong>API Name</strong> - this is what you&apos;ll use in the webhook</li>
          </ol>
        </Section>

        {/* Visual Comparison */}
        <Section title="Where They Appear in TeamTailor">
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Answers
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Visible on the candidate&apos;s <strong>application card</strong> for that specific job.
                Recruiters see these when reviewing applicants for a position.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Custom Fields
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Visible on the candidate&apos;s <strong>profile page</strong>.
                Available across all applications and can be used for filtering/searching candidates.
              </p>
            </div>
          </div>
        </Section>

        {/* Quick Reference */}
        <Section title="Quick Reference">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="py-3 pr-4 font-medium text-zinc-900 dark:text-zinc-100"></th>
                  <th className="py-3 pr-4 font-medium text-blue-700 dark:text-blue-300">Answers</th>
                  <th className="py-3 pr-4 font-medium text-purple-700 dark:text-purple-300">Custom Fields</th>
                </tr>
              </thead>
              <tbody className="text-zinc-600 dark:text-zinc-400">
                <tr className="border-b border-zinc-100 dark:border-zinc-800/50">
                  <td className="py-3 pr-4 font-medium">Prefix</td>
                  <td className="py-3 pr-4"><Code>tt_answer_</Code></td>
                  <td className="py-3 pr-4"><Code>tt_custom_</Code></td>
                </tr>
                <tr className="border-b border-zinc-100 dark:border-zinc-800/50">
                  <td className="py-3 pr-4 font-medium">Identifier</td>
                  <td className="py-3 pr-4">Question ID (number)</td>
                  <td className="py-3 pr-4">API Name (text)</td>
                </tr>
                <tr className="border-b border-zinc-100 dark:border-zinc-800/50">
                  <td className="py-3 pr-4 font-medium">Scope</td>
                  <td className="py-3 pr-4">Per job application</td>
                  <td className="py-3 pr-4">Per candidate (global)</td>
                </tr>
                <tr className="border-b border-zinc-100 dark:border-zinc-800/50">
                  <td className="py-3 pr-4 font-medium">Set up in</td>
                  <td className="py-3 pr-4">Job → Application form</td>
                  <td className="py-3 pr-4">Settings → Custom fields</td>
                </tr>
                <tr className="border-b border-zinc-100 dark:border-zinc-800/50">
                  <td className="py-3 pr-4 font-medium">Example</td>
                  <td className="py-3 pr-4"><Code>tt_answer_3165763</Code></td>
                  <td className="py-3 pr-4"><Code>tt_custom_location</Code></td>
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
