import Link from 'next/link'

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <span>&larr;</span> Back to home
        </Link>

        <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          ManyChat Integration Guide
        </h1>
        <p className="mb-12 text-zinc-600 dark:text-zinc-400">
          Connect your ManyChat chatbot to automatically create candidates in TeamTailor.
        </p>

        {/* How It Works */}
        <Section title="How It Works">
          <p>
            When someone completes your ManyChat flow, their information is sent to this webhook
            which creates a candidate in TeamTailor and applies them to a specific job.
          </p>
          <ol className="mt-4 list-inside list-decimal space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>User completes your ManyChat chatbot flow</li>
            <li>ManyChat sends their data to this webhook</li>
            <li>A candidate profile is created (or updated if they already exist)</li>
            <li>They&apos;re applied to the job you specify</li>
            <li>Any screening answers and notes are attached to their profile</li>
          </ol>
        </Section>

        {/* ManyChat Custom Fields Setup */}
        <Section title="Step 1: Create Custom Fields in ManyChat">
          <p className="mb-4">
            Before setting up the webhook, you need to create custom fields in ManyChat to store the
            data you&apos;ll send to TeamTailor. All fields that will be sent must use the{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800">tt_</code>{' '}
            prefix.
          </p>

          <h3 className="mb-3 mt-6 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Creating Custom Fields
          </h3>
          <ol className="list-inside list-decimal space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>Go to <strong>Settings &rarr; Custom Fields</strong> in ManyChat</li>
            <li>Click <strong>+ New User Field</strong></li>
            <li>
              Name your field with the <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800">tt_</code> prefix
            </li>
            <li>Set the appropriate field type (Text, Number, etc.)</li>
          </ol>

          <h3 className="mb-3 mt-6 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Required Custom Fields
          </h3>
          <Table
            headers={['Field Name', 'Type', 'Description']}
            rows={[
              ['tt_email', 'Text', "Candidate's email (required)"],
              ['tt_first_name', 'Text', 'First name'],
              ['tt_last_name', 'Text', 'Last name'],
              ['tt_phone', 'Text', 'Phone number'],
            ]}
          />

          <h3 className="mb-3 mt-6 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Optional Custom Fields
          </h3>
          <Table
            headers={['Field Name', 'Type', 'Description']}
            rows={[
              ['tt_tags', 'Text', 'Comma-separated tags (e.g., "ManyChat,Summer2025")'],
              ['tt_notes', 'Text', 'Notes/summary to add to candidate profile'],
              ['tt_answer_XXXXX', 'Text', 'Answer to TeamTailor question (replace XXXXX with question ID)'],
              ['tt_custom_XXXXX', 'Text', 'Custom field value (replace XXXXX with API name)'],
            ]}
          />

          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Important:</strong> The field names must match exactly. For example, if you want to send
              an answer to TeamTailor question ID 3165763, create a field named exactly{' '}
              <code className="rounded bg-amber-100 px-1 dark:bg-amber-900">tt_answer_3165763</code>
            </p>
          </div>
        </Section>

        {/* Collecting Data in Flow */}
        <Section title="Step 2: Collect Data in Your Flow">
          <p className="mb-4">
            In your ManyChat flow, use actions to save user responses to your custom fields:
          </p>

          <ol className="list-inside list-decimal space-y-3 text-zinc-600 dark:text-zinc-400">
            <li>
              <strong>Ask for information</strong> using User Input or other blocks
            </li>
            <li>
              <strong>Save to custom field</strong> using the &ldquo;Set Custom Field&rdquo; action
              <ul className="ml-6 mt-2 list-inside list-disc space-y-1 text-sm">
                <li>Select your <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">tt_</code> prefixed field</li>
                <li>Set the value from the user&apos;s response</li>
              </ul>
            </li>
            <li>
              <strong>For email:</strong> You can use ManyChat&apos;s built-in email capture, then copy it to{' '}
              <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">tt_email</code>
            </li>
          </ol>

          <h3 className="mb-3 mt-6 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Example Flow Structure
          </h3>
          <div className="rounded-lg bg-zinc-100 p-4 text-sm dark:bg-zinc-800">
            <p className="font-mono text-zinc-700 dark:text-zinc-300">
              1. Welcome message<br />
              2. Ask: &ldquo;What&apos;s your email?&rdquo; &rarr; Save to <strong>tt_email</strong><br />
              3. Ask: &ldquo;What&apos;s your full name?&rdquo; &rarr; Parse &amp; save to <strong>tt_first_name</strong>, <strong>tt_last_name</strong><br />
              4. Ask: &ldquo;Phone number?&rdquo; &rarr; Save to <strong>tt_phone</strong><br />
              5. Ask: &ldquo;Do you have work rights?&rdquo; &rarr; Save to <strong>tt_answer_3165763</strong><br />
              6. Set <strong>tt_tags</strong> = &ldquo;ManyChat,Instagram&rdquo;<br />
              7. External Request (webhook) &rarr; Send to TeamTailor
            </p>
          </div>
        </Section>

        {/* Setting Up Webhook */}
        <Section title="Step 3: Configure the Webhook">
          <p className="mb-4">Add an External Request action at the end of your flow:</p>

          <div className="space-y-4">
            <Step number={1} title="Add External Request">
              In your ManyChat flow editor, add an &ldquo;External Request&rdquo; action after you&apos;ve
              collected all the data.
            </Step>

            <Step number={2} title="Configure the Request">
              <ul className="mt-2 list-inside list-disc space-y-1 text-zinc-600 dark:text-zinc-400">
                <li>
                  <strong>Method:</strong> POST
                </li>
                <li>
                  <strong>URL:</strong>{' '}
                  <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800">
                    https://thread-recruitment-integration.vercel.app/api/webhook/YOUR_SECRET?job_id=12345
                  </code>
                </li>
                <li>
                  <strong>Content-Type header:</strong> application/json
                </li>
              </ul>
              <p className="mt-2 text-sm text-zinc-500">
                Replace <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">YOUR_SECRET</code> with your webhook secret and{' '}
                <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">12345</code> with your TeamTailor job ID.
              </p>
            </Step>

            <Step number={3} title="Set Up the JSON Body">
              <p className="mb-2 text-zinc-600 dark:text-zinc-400">
                Map your ManyChat custom fields to the JSON body. Use the ManyChat variable syntax:
              </p>
              <CodeBlock>
                {`{
  "tt_email": "{{tt_email}}",
  "tt_first_name": "{{tt_first_name}}",
  "tt_last_name": "{{tt_last_name}}",
  "tt_phone": "{{tt_phone}}",
  "tt_tags": "{{tt_tags}}",
  "tt_answer_3165763": "{{tt_answer_3165763}}",
  "tt_notes": "{{tt_notes}}"
}`}
              </CodeBlock>
              <p className="mt-2 text-sm text-zinc-500">
                Each <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">{`{{field_name}}`}</code> will be replaced with the
                value from that custom field.
              </p>
            </Step>

            <Step number={4} title="Enable JSON Encoding">
              Turn on &ldquo;Encode to JSON&rdquo; for each field to handle special characters (quotes, newlines) properly.
            </Step>
          </div>
        </Section>

        {/* Answers vs Custom Fields */}
        <Section title="Answers vs Custom Fields">
          <p className="mb-4">
            TeamTailor has two ways to store extra data about candidates. It&apos;s important to understand the difference:
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                Answers (<code className="text-sm">tt_answer_</code>)
              </h4>
              <p className="mt-2 text-sm text-blue-800 dark:text-blue-200">
                Responses to <strong>job-specific screening questions</strong>.
              </p>
              <ul className="mt-2 list-inside list-disc text-sm text-blue-700 dark:text-blue-300">
                <li>Appear on the candidate&apos;s application for that job</li>
                <li>Set up per-job in TeamTailor&apos;s job settings</li>
                <li>Examples: &ldquo;Do you have work rights?&rdquo;, &ldquo;Years of experience?&rdquo;</li>
              </ul>
            </div>

            <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-900 dark:bg-purple-950">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100">
                Custom Fields (<code className="text-sm">tt_custom_</code>)
              </h4>
              <p className="mt-2 text-sm text-purple-800 dark:text-purple-200">
                Extra data on the <strong>candidate profile itself</strong>.
              </p>
              <ul className="mt-2 list-inside list-disc text-sm text-purple-700 dark:text-purple-300">
                <li>Visible across all jobs the candidate applies to</li>
                <li>Set up globally in TeamTailor settings</li>
                <li>Examples: &ldquo;Traffic source&rdquo;, &ldquo;Region&rdquo;, &ldquo;Portfolio URL&rdquo;</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-100 p-4 dark:border-zinc-700 dark:bg-zinc-800">
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              <strong>In short:</strong> Answers are per-application (job-specific), Custom Fields are per-candidate (global).
            </p>
          </div>
        </Section>

        {/* Field Reference */}
        <Section title="Field Reference">
          <p className="mb-4">
            All fields must start with <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800">tt_</code> to be
            processed. Fields without this prefix are ignored.
          </p>

          <h3 className="mb-3 mt-6 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Candidate Information
          </h3>
          <Table
            headers={['Field', 'Description', 'Required']}
            rows={[
              ['tt_email', "Candidate's email address", 'Yes'],
              ['tt_first_name', 'First name', 'No'],
              ['tt_last_name', 'Last name', 'No'],
              ['tt_phone', 'Phone number (any format)', 'No'],
              ['tt_tags', 'Tags (comma-separated)', 'No'],
            ]}
          />

          <h3 className="mb-3 mt-8 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Screening Answers (Job-Specific)
          </h3>
          <p className="mb-3 text-zinc-600 dark:text-zinc-400">
            To send answers to TeamTailor screening questions, use the format{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800">
              tt_answer_QUESTION_ID
            </code>
            . These answers appear on the candidate&apos;s application for the specific job.
            Get the question IDs from your TeamTailor admin.
          </p>
          <CodeBlock>
            {`{
  "tt_answer_3165763": "Yes",
  "tt_answer_3165764": "Auckland"
}`}
          </CodeBlock>
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-500">
            Values are automatically converted based on the question type in TeamTailor
            (Boolean, Number, Text, etc.). For Yes/No questions, use &ldquo;yes&rdquo;, &ldquo;true&rdquo;, or &ldquo;1&rdquo;.
          </p>

          <h3 className="mb-3 mt-8 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Custom Fields (Candidate Profile)
          </h3>
          <p className="mb-3 text-zinc-600 dark:text-zinc-400">
            To set TeamTailor custom field values on the candidate&apos;s profile, use the format{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800">
              tt_custom_API_NAME
            </code>
            . These values are visible across all jobs the candidate applies to.
            The API name is set when creating the custom field in TeamTailor (Settings &rarr; Custom Fields).
          </p>
          <CodeBlock>
            {`{
  "tt_custom_source": "Instagram",
  "tt_custom_region": "Auckland"
}`}
          </CodeBlock>
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-500">
            Values are automatically converted based on the field type (Text, URL, Checkbox, Number, Date).
          </p>

          <h3 className="mb-3 mt-8 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Notes (Comments)
          </h3>
          <p className="mb-3 text-zinc-600 dark:text-zinc-400">
            Add a comment to the candidate&apos;s activity feed with screening summaries or other context.
            This appears under the &ldquo;Comments&rdquo; tab on the candidate card in TeamTailor:
          </p>
          <CodeBlock>
            {`{
  "tt_notes": "Completed ManyChat screening.\\n\\nAvailable: Immediately\\nExperience: 3 years"
}`}
          </CodeBlock>
        </Section>

        {/* Multiple Jobs */}
        <Section title="Multiple Jobs">
          <p>
            The <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800">job_id</code> in the URL determines which job the candidate
            is applied to. To route candidates to different jobs:
          </p>
          <ul className="mt-3 list-inside list-disc space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>Create separate ManyChat flows for each job, each with its own webhook URL</li>
            <li>Or use conditional logic to send to different webhook URLs based on user responses</li>
            <li>Each URL should have the appropriate job_id for that position</li>
          </ul>
        </Section>

        {/* Duplicate Handling */}
        <Section title="Duplicate Candidates">
          <p>
            If a candidate with the same email already exists in TeamTailor, their profile will be
            updated with the new information instead of creating a duplicate. They&apos;ll also be applied
            to the new job if they haven&apos;t applied already.
          </p>
        </Section>

        {/* Rate Limits */}
        <Section title="Rate Limits">
          <p>
            The webhook accepts up to 60 requests per minute from the same IP address. This is more
            than enough for normal chatbot traffic. If you&apos;re doing bulk imports, space them out over
            time.
          </p>
        </Section>

        {/* Troubleshooting */}
        <Section title="Troubleshooting">
          <div className="space-y-4">
            <Troubleshoot title="401 Unauthorized">
              The secret token in your URL doesn&apos;t match. Double-check the webhook URL.
            </Troubleshoot>
            <Troubleshoot title="400 Missing job_id">
              Add <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800">?job_id=12345</code> to your webhook URL.
            </Troubleshoot>
            <Troubleshoot title="400 Missing required field: tt_email">
              The email field is required. Make sure you&apos;re sending{' '}
              <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800">tt_email</code> in your JSON body and that the
              ManyChat custom field has a value.
            </Troubleshoot>
            <Troubleshoot title="429 Too Many Requests">
              You&apos;ve hit the rate limit. Wait a minute and try again.
            </Troubleshoot>
            <Troubleshoot title="Candidate created but answers missing">
              Check that your question IDs are correct. The system continues even if individual answers fail.
              Verify the question ID exists in TeamTailor.
            </Troubleshoot>
            <Troubleshoot title="Data not appearing in TeamTailor">
              <ul className="mt-1 list-inside list-disc space-y-1">
                <li>Check that all field names start with <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">tt_</code></li>
                <li>Verify &ldquo;Encode to JSON&rdquo; is enabled in ManyChat</li>
                <li>Check that the custom field values aren&apos;t empty</li>
              </ul>
            </Troubleshoot>
          </div>
        </Section>

        {/* Example */}
        <Section title="Complete Example">
          <p className="mb-4">Here&apos;s a full example of what the webhook receives:</p>
          <CodeBlock>
            {`POST https://thread-recruitment-integration.vercel.app/api/webhook/abc123?job_id=6913207
Content-Type: application/json

{
  "tt_first_name": "Sarah",
  "tt_last_name": "Chen",
  "tt_email": "sarah.chen@example.com",
  "tt_phone": "+64 21 123 4567",
  "tt_tags": "ManyChat,Instagram,Summer2025",
  "tt_answer_3165763": "Yes",
  "tt_answer_3165764": "Auckland",
  "tt_custom_source": "Instagram Ad",
  "tt_notes": "Completed screening flow.\\n\\nAvailable from: January 2025\\nPreferred location: Auckland"
}`}
          </CodeBlock>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">This will:</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-zinc-600 dark:text-zinc-400">
            <li>Create Sarah as a candidate (or update if she exists)</li>
            <li>Apply her to job 6913207</li>
            <li>Add tags: ManyChat, Instagram, Summer2025</li>
            <li>Record her answers to questions 3165763 and 3165764</li>
            <li>Set her &ldquo;source&rdquo; custom field to &ldquo;Instagram Ad&rdquo;</li>
            <li>Add a comment to the activity feed with the screening summary</li>
          </ul>
        </Section>

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

function Step({
  number,
  title,
  children,
}: {
  number: number
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
        {number}
      </div>
      <div>
        <h4 className="font-medium text-zinc-900 dark:text-zinc-100">{title}</h4>
        <div className="mt-1 text-zinc-600 dark:text-zinc-400">{children}</div>
      </div>
    </div>
  )
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100 dark:bg-zinc-800">
      <code>{children}</code>
    </pre>
  )
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-800">
            {headers.map((header) => (
              <th
                key={header}
                className="py-2 pr-4 font-medium text-zinc-900 dark:text-zinc-100"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800/50">
              {row.map((cell, j) => (
                <td key={j} className="py-2 pr-4 text-zinc-600 dark:text-zinc-400">
                  {j === 0 ? (
                    <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800">
                      {cell}
                    </code>
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Troubleshoot({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <h4 className="font-medium text-zinc-900 dark:text-zinc-100">{title}</h4>
      <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{children}</div>
    </div>
  )
}
