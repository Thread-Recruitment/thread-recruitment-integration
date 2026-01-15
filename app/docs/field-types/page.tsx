import Link from 'next/link'

export default function FieldTypesPage() {
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
          Field Types &amp; Value Formatting
        </h1>
        <p className="mb-12 text-zinc-600 dark:text-zinc-400">
          How to format values in ManyChat so they convert correctly to TeamTailor field types.
        </p>

        {/* Overview */}
        <Section title="How It Works">
          <p className="mb-4">
            When the webhook receives your data, it automatically converts text values from ManyChat
            into the correct format for TeamTailor. The conversion depends on the field type
            configured in TeamTailor.
          </p>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Key point:</strong> You always send text values from ManyChat. The webhook
              looks up the field type in TeamTailor and converts your text automatically.
            </p>
          </div>
        </Section>

        {/* Screening Answers */}
        <Section title="Screening Answer Types">
          <p className="mb-4">
            TeamTailor screening questions have different types. Here&apos;s how to format your
            ManyChat values for each:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="py-3 pr-4 font-medium text-zinc-900 dark:text-zinc-100">TeamTailor Type</th>
                  <th className="py-3 pr-4 font-medium text-zinc-900 dark:text-zinc-100">ManyChat Value</th>
                  <th className="py-3 pr-4 font-medium text-zinc-900 dark:text-zinc-100">Examples</th>
                </tr>
              </thead>
              <tbody className="text-zinc-600 dark:text-zinc-400">
                <tr className="border-b border-zinc-100 dark:border-zinc-800/50">
                  <td className="py-3 pr-4">
                    <Code>Boolean</Code>
                    <div className="mt-1 text-xs text-zinc-500">Yes/No questions</div>
                  </td>
                  <td className="py-3 pr-4">
                    Text: <Code>yes</Code>, <Code>true</Code>, <Code>1</Code>, or <Code>on</Code> for true
                    <br />
                    Anything else = false
                  </td>
                  <td className="py-3 pr-4">
                    <Code>&quot;Yes&quot;</Code> → true<br />
                    <Code>&quot;no&quot;</Code> → false<br />
                    <Code>&quot;1&quot;</Code> → true
                  </td>
                </tr>
                <tr className="border-b border-zinc-100 dark:border-zinc-800/50">
                  <td className="py-3 pr-4">
                    <Code>Text</Code>
                    <div className="mt-1 text-xs text-zinc-500">Free text answers</div>
                  </td>
                  <td className="py-3 pr-4">
                    Any text value (sent as-is)
                  </td>
                  <td className="py-3 pr-4">
                    <Code>&quot;Auckland, NZ&quot;</Code><br />
                    <Code>&quot;3 years experience&quot;</Code>
                  </td>
                </tr>
                <tr className="border-b border-zinc-100 dark:border-zinc-800/50">
                  <td className="py-3 pr-4">
                    <Code>Number</Code> / <Code>Range</Code>
                    <div className="mt-1 text-xs text-zinc-500">Numeric values</div>
                  </td>
                  <td className="py-3 pr-4">
                    Numeric string (decimals OK)
                  </td>
                  <td className="py-3 pr-4">
                    <Code>&quot;5&quot;</Code> → 5<br />
                    <Code>&quot;3.5&quot;</Code> → 3.5<br />
                    <Code>&quot;$50k&quot;</Code> → text (not a number)
                  </td>
                </tr>
                <tr className="border-b border-zinc-100 dark:border-zinc-800/50">
                  <td className="py-3 pr-4">
                    <Code>Choice</Code>
                    <div className="mt-1 text-xs text-zinc-500">Multiple choice</div>
                  </td>
                  <td className="py-3 pr-4">
                    Choice ID(s) from TeamTailor<br />
                    Comma-separated for multiple
                  </td>
                  <td className="py-3 pr-4">
                    <Code>&quot;12345&quot;</Code> → single choice<br />
                    <Code>&quot;123,456&quot;</Code> → multiple choices
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Tip for Boolean questions:</strong> In ManyChat, use buttons with values like
              &ldquo;Yes&rdquo; or &ldquo;No&rdquo; and save directly to the custom field. The webhook
              handles the conversion.
            </p>
          </div>
        </Section>

        {/* Custom Fields */}
        <Section title="Custom Field Types">
          <p className="mb-4">
            TeamTailor custom fields also have types. Here&apos;s the conversion mapping:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="py-3 pr-4 font-medium text-zinc-900 dark:text-zinc-100">TeamTailor Type</th>
                  <th className="py-3 pr-4 font-medium text-zinc-900 dark:text-zinc-100">ManyChat Value</th>
                  <th className="py-3 pr-4 font-medium text-zinc-900 dark:text-zinc-100">Examples</th>
                </tr>
              </thead>
              <tbody className="text-zinc-600 dark:text-zinc-400">
                <tr className="border-b border-zinc-100 dark:border-zinc-800/50">
                  <td className="py-3 pr-4">
                    <Code>Text</Code>
                  </td>
                  <td className="py-3 pr-4">Any text (sent as-is)</td>
                  <td className="py-3 pr-4"><Code>&quot;Auckland&quot;</Code></td>
                </tr>
                <tr className="border-b border-zinc-100 dark:border-zinc-800/50">
                  <td className="py-3 pr-4">
                    <Code>Checkbox</Code>
                    <div className="mt-1 text-xs text-zinc-500">True/false toggle</div>
                  </td>
                  <td className="py-3 pr-4">
                    <Code>yes</Code>, <Code>true</Code>, <Code>1</Code>, <Code>on</Code> for checked
                    <br />
                    Anything else = unchecked
                  </td>
                  <td className="py-3 pr-4">
                    <Code>&quot;yes&quot;</Code> → checked<br />
                    <Code>&quot;no&quot;</Code> → unchecked
                  </td>
                </tr>
                <tr className="border-b border-zinc-100 dark:border-zinc-800/50">
                  <td className="py-3 pr-4">
                    <Code>Number</Code>
                  </td>
                  <td className="py-3 pr-4">Numeric string</td>
                  <td className="py-3 pr-4">
                    <Code>&quot;42&quot;</Code> → 42<br />
                    <Code>&quot;3.14&quot;</Code> → 3.14
                  </td>
                </tr>
                <tr className="border-b border-zinc-100 dark:border-zinc-800/50">
                  <td className="py-3 pr-4">
                    <Code>URL</Code>
                  </td>
                  <td className="py-3 pr-4">Full URL string</td>
                  <td className="py-3 pr-4"><Code>&quot;https://example.com&quot;</Code></td>
                </tr>
                <tr className="border-b border-zinc-100 dark:border-zinc-800/50">
                  <td className="py-3 pr-4">
                    <Code>Date</Code>
                  </td>
                  <td className="py-3 pr-4">ISO date format preferred</td>
                  <td className="py-3 pr-4"><Code>&quot;2025-01-15&quot;</Code></td>
                </tr>
                <tr className="border-b border-zinc-100 dark:border-zinc-800/50">
                  <td className="py-3 pr-4">
                    <Code>Email</Code>
                  </td>
                  <td className="py-3 pr-4">Email address string</td>
                  <td className="py-3 pr-4"><Code>&quot;user@example.com&quot;</Code></td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        {/* ManyChat Setup */}
        <Section title="Setting Up ManyChat Fields">
          <p className="mb-4">
            Here&apos;s how to configure ManyChat to collect and send data correctly:
          </p>

          <h3 className="mb-3 mt-6 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            1. Create Custom Fields in ManyChat
          </h3>
          <ul className="list-inside list-disc space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>Go to <strong>Settings → Custom Fields</strong></li>
            <li>Create fields with the <Code>tt_</Code> prefix</li>
            <li>Use <strong>Text</strong> type for all fields (the webhook handles conversion)</li>
          </ul>

          <h3 className="mb-3 mt-6 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            2. Collect Boolean Values (Yes/No Questions)
          </h3>
          <div className="rounded-lg bg-zinc-100 p-4 text-sm dark:bg-zinc-800">
            <p className="font-mono text-zinc-700 dark:text-zinc-300">
              Use <strong>Quick Reply buttons</strong>:<br /><br />
              Button 1: &ldquo;Yes&rdquo; → Set <Code>tt_answer_123456</Code> = &ldquo;Yes&rdquo;<br />
              Button 2: &ldquo;No&rdquo; → Set <Code>tt_answer_123456</Code> = &ldquo;No&rdquo;
            </p>
          </div>

          <h3 className="mb-3 mt-6 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            3. Collect Text Values
          </h3>
          <div className="rounded-lg bg-zinc-100 p-4 text-sm dark:bg-zinc-800">
            <p className="font-mono text-zinc-700 dark:text-zinc-300">
              Use <strong>User Input</strong> block:<br /><br />
              Ask: &ldquo;What city are you based in?&rdquo;<br />
              Save reply to: <Code>tt_custom_location</Code>
            </p>
          </div>

          <h3 className="mb-3 mt-6 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            4. Set Static Values
          </h3>
          <div className="rounded-lg bg-zinc-100 p-4 text-sm dark:bg-zinc-800">
            <p className="font-mono text-zinc-700 dark:text-zinc-300">
              Use <strong>Set Custom Field</strong> action:<br /><br />
              Set <Code>tt_tags</Code> = &ldquo;ManyChat,Instagram&rdquo;<br />
              Set <Code>tt_custom_source</Code> = &ldquo;Instagram Ad Campaign&rdquo;
            </p>
          </div>
        </Section>

        {/* Common Patterns */}
        <Section title="Common Patterns">
          <h3 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Work Rights Question (Boolean)
          </h3>
          <div className="mb-6 rounded-lg bg-zinc-100 p-4 text-sm dark:bg-zinc-800">
            <p className="font-mono text-zinc-700 dark:text-zinc-300">
              TeamTailor: Boolean question &ldquo;Do you have work rights?&rdquo; (ID: 3165763)<br /><br />
              ManyChat field: <Code>tt_answer_3165763</Code> (Text type)<br />
              Quick Reply buttons: &ldquo;Yes&rdquo; / &ldquo;No&rdquo;<br />
              Save button text to field<br /><br />
              Result: &ldquo;Yes&rdquo; → <Code>{`{ boolean: true }`}</Code> in TeamTailor
            </p>
          </div>

          <h3 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Salary Expectations (Text)
          </h3>
          <div className="mb-6 rounded-lg bg-zinc-100 p-4 text-sm dark:bg-zinc-800">
            <p className="font-mono text-zinc-700 dark:text-zinc-300">
              TeamTailor: Text question &ldquo;Salary expectations?&rdquo; (ID: 3522439)<br /><br />
              ManyChat field: <Code>tt_answer_3522439</Code> (Text type)<br />
              User Input or Quick Replies: &ldquo;$80-100k&rdquo;, &ldquo;$100-120k&rdquo;, etc.<br /><br />
              Result: Sent as text to TeamTailor
            </p>
          </div>

          <h3 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Visa Sponsorship (Checkbox Custom Field)
          </h3>
          <div className="rounded-lg bg-zinc-100 p-4 text-sm dark:bg-zinc-800">
            <p className="font-mono text-zinc-700 dark:text-zinc-300">
              TeamTailor: Checkbox custom field (API name: visa-sponsorship-required)<br /><br />
              ManyChat field: <Code>tt_custom_visa-sponsorship-required</Code> (Text type)<br />
              Quick Reply buttons: &ldquo;Yes&rdquo; / &ldquo;No&rdquo;<br /><br />
              Result: &ldquo;Yes&rdquo; → checkbox checked in TeamTailor
            </p>
          </div>
        </Section>

        {/* Quick Reference */}
        <Section title="Quick Reference: Truthy Values">
          <p className="mb-4">
            For Boolean questions and Checkbox fields, these values are treated as <strong>true</strong>:
          </p>
          <div className="flex flex-wrap gap-2">
            <Code>yes</Code>
            <Code>Yes</Code>
            <Code>YES</Code>
            <Code>true</Code>
            <Code>True</Code>
            <Code>1</Code>
            <Code>on</Code>
          </div>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            Everything else (including <Code>no</Code>, <Code>false</Code>, <Code>0</Code>, empty string) is treated as <strong>false</strong>.
          </p>
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
