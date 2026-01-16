'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const NAV_ITEMS = [
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'step-1', label: 'Step 1: Custom Fields' },
  { id: 'step-2', label: 'Step 2: Collect Data' },
  { id: 'step-3', label: 'Step 3: Configure Webhook' },
  { id: 'step-4', label: 'Step 4: Test' },
  { id: 'step-5', label: 'Step 5: Confirm Sync' },
  { id: 'field-reference', label: 'Field Reference' },
  { id: 'faq', label: 'FAQ' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
  { id: 'examples', label: 'Examples' },
]

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('how-it-works')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )

    NAV_ITEMS.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950">
      {/* Sticky Navigation */}
      <nav className="fixed left-0 top-0 z-50 hidden h-screen w-64 overflow-y-auto border-r border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 lg:block">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <span>&larr;</span> Back to home
        </Link>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          On this page
        </h2>
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ id, label }) => (
            <li key={id}>
              <button
                onClick={() => scrollToSection(id)}
                className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                  activeSection === id
                    ? 'bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100'
                }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <div className="lg:ml-64">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 lg:hidden dark:hover:text-zinc-100"
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
          <Section id="how-it-works" title="How It Works">
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
          <Section id="step-1" title="Step 1: Create Custom Fields in ManyChat">
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
              Base Candidate Custom Fields
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
              Additional Custom Fields
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

            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Need to find Question IDs or Custom Field API names?</strong>{' '}
                <Link
                  href="/docs/finding-ids"
                  className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  See our guide on finding IDs &rarr;
                </Link>
              </p>
            </div>
          </Section>

          {/* Collecting Data in Flow */}
          <Section id="step-2" title="Step 2: Collect Data in Your Flow">
            <p className="mb-4">
              In your ManyChat flow, use actions to save user responses to your custom fields:
            </p>

            <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>How should I format values for Boolean, Number, or other field types?</strong>{' '}
                <Link
                  href="/docs/field-types"
                  className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  See field types &amp; value formatting &rarr;
                </Link>
              </p>
            </div>

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
          <Section id="step-3" title="Step 3: Configure the Webhook">
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
                  Map your ManyChat custom fields to the JSON body. <strong>Important:</strong> Do NOT put quotes around the variable placeholders.
                </p>
                <CodeBlock>
                  {`{
  "tt_email": {{tt_email}},
  "tt_first_name": {{tt_first_name}},
  "tt_last_name": {{tt_last_name}},
  "tt_phone": {{tt_phone}},
  "tt_tags": {{tt_tags}},
  "tt_answer_3165763": {{tt_answer_3165763}},
  "tt_notes": {{tt_notes}}
}`}
                </CodeBlock>
                <p className="mt-2 text-sm text-zinc-500">
                  The variable placeholders (highlighted in blue) should be inserted directly without surrounding quotes.
                  ManyChat will handle the JSON encoding.
                </p>
              </Step>

              <Step number={4} title="Enable JSON Encoding">
                <p className="mb-3 text-zinc-600 dark:text-zinc-400">
                  For each field, make sure <strong>&ldquo;Encode to JSON&rdquo; is checked</strong>. This ensures special characters (quotes, newlines) are properly escaped.
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/manychat_external_request_setup.png"
                  alt="ManyChat External Request setup showing Encode to JSON enabled and no quotes around variables"
                  className="rounded-lg border border-zinc-200 dark:border-zinc-700"
                />
                <p className="mt-2 text-sm text-zinc-500">
                  Notice: &ldquo;Encode to JSON&rdquo; is checked, and variables are placed without quotes around them.
                </p>
              </Step>
            </div>
          </Section>

          {/* Step 4: Test the Integration */}
          <Section id="step-4" title="Step 4: Test the Integration">
            <p className="mb-4">
              Before going live, test the integration to make sure everything is working:
            </p>

            <h3 className="mb-3 mt-6 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Option 1: Test via Instagram
            </h3>
            <ol className="list-inside list-decimal space-y-3 text-zinc-600 dark:text-zinc-400">
              <li>
                <strong>Run through the flow yourself</strong> by messaging your Instagram account
              </li>
              <li>
                <strong>Complete all the steps</strong> in your ManyChat flow that collect data
              </li>
              <li>
                <strong>Use a test email address</strong> (e.g., yourname+test@example.com)
              </li>
            </ol>

            <h3 className="mb-3 mt-6 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Option 2: Test with an Existing Contact
            </h3>
            <p className="mb-3 text-zinc-600 dark:text-zinc-400">
              In ManyChat, you can test the webhook with an existing contact without going through Instagram:
            </p>
            <ol className="mb-4 list-inside list-decimal space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>Go to <strong>Contacts</strong> in ManyChat and select a test contact</li>
              <li>Make sure the contact has values set for your <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">tt_</code> fields</li>
              <li>Open your flow and click the <strong>Test</strong> button</li>
              <li>Select the test contact and run the flow</li>
            </ol>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/manychat_contact_for_testing.png"
              alt="ManyChat contact selection for testing the webhook flow"
              className="rounded-lg border border-zinc-200 dark:border-zinc-700"
            />
          </Section>

          {/* Step 5: Confirm the Sync */}
          <Section id="step-5" title="Step 5: Confirm the Sync">
            <p className="mb-4">
              After completing a test, verify everything synced correctly:
            </p>

            <h3 className="mb-3 mt-6 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Slack Notification
            </h3>
            <p className="mb-3 text-zinc-600 dark:text-zinc-400">
              You&apos;ll receive a Slack notification with a summary of the sync. You can use this to review what fields passed and what failed (missing, debugging etc):
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/slack_notificaiton.png"
              alt="Slack notification showing successful candidate sync with operation summary"
              className="rounded-lg border border-zinc-200 dark:border-zinc-700"
            />

            <h3 className="mb-3 mt-8 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              TeamTailor Candidate
            </h3>
            <p className="mb-3 text-zinc-600 dark:text-zinc-400">
              In TeamTailor, view the candidate profile to verify all synced data:
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/teamtailor_review_candidate.png"
              alt="TeamTailor candidate profile showing synced data from ManyChat"
              className="rounded-lg border border-zinc-200 dark:border-zinc-700"
            />
          </Section>

          {/* Answers vs Custom Fields - Link to dedicated page */}
          <div className="mb-12 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-zinc-600 dark:text-zinc-400">
              <strong className="text-zinc-900 dark:text-zinc-100">What&apos;s the difference between Answers and Custom Fields?</strong>{' '}
              <Link
                href="/docs/answers-vs-custom-fields"
                className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Learn when to use each &rarr;
              </Link>
            </p>
          </div>

          {/* Field Reference */}
          <Section id="field-reference" title="Field Reference">
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

          {/* Frequently Asked Questions */}
          <Section id="faq" title="Frequently Asked Questions">
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  How do I apply candidates to multiple jobs?
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  The <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800">job_id</code> in the URL determines which job the candidate
                  is applied to. To route candidates to different jobs:
                </p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-zinc-600 dark:text-zinc-400">
                  <li>Create separate ManyChat flows for each job, each with its own webhook URL</li>
                  <li>Or use conditional logic to send to different webhook URLs based on user responses</li>
                  <li>Each URL should have the appropriate job_id for that position</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  What happens if a candidate submits again?
                </h3>
                <p className="mb-3 text-zinc-600 dark:text-zinc-400">
                  The system intelligently handles re-submissions (same email):
                </p>
                <ul className="list-inside list-disc space-y-1 text-zinc-600 dark:text-zinc-400">
                  <li><strong>Candidate:</strong> Merged with existing profile (updated, not duplicated)</li>
                  <li><strong>Job Application:</strong> Skipped if already applied to this job</li>
                  <li><strong>Answers:</strong> Updated if answer already exists for that question</li>
                  <li><strong>Custom Fields:</strong> Updated if value already exists for that field</li>
                  <li><strong>Notes:</strong> Always creates a new entry (activity timeline)</li>
                </ul>
                <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                  This means candidates can safely resubmit to correct information without creating duplicates.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Are there rate limits?
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  The webhook accepts up to 60 requests per minute from the same IP address. This is more
                  than enough for normal chatbot traffic. If you&apos;re doing bulk imports, space them out over
                  time.
                </p>
              </div>
            </div>
          </Section>

          {/* Troubleshooting */}
          <Section id="troubleshooting" title="Troubleshooting">
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
                  <li>Verify &ldquo;Encode to JSON&rdquo; is <strong>enabled</strong> in ManyChat</li>
                  <li>Make sure there are <strong>no quotes</strong> around the variable placeholders</li>
                  <li>Check that the custom field values aren&apos;t empty</li>
                </ul>
              </Troubleshoot>
            </div>
          </Section>

          {/* Examples */}
          <Section id="examples" title="Examples">
            <h3 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Complete Example
            </h3>
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

            <h3 className="mb-3 mt-10 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Real Request Example
            </h3>
            <p className="mb-4">
              Here&apos;s a comprehensive example showing all field types, including the test job&apos;s
              actual question IDs and custom fields:
            </p>
            <CodeBlock>
              {`POST /api/webhook/[secret]?job_id=6998249
Content-Type: application/json

{
  "tt_first_name": "Jane",
  "tt_last_name": "Doe",
  "tt_email": "jane.doe@example.com",
  "tt_phone": "+64 21 555 1234",
  "tt_tags": "ManyChat,Instagram,test-webhook",

  // Screening Answers (job-specific questions)
  "tt_answer_3165763": "Yes",                              // Do you have permanent work rights? (Boolean)
  "tt_answer_3213708": "Wellington, New Zealand",          // Location (Text)
  "tt_answer_3522414": "N/A - I have permanent work rights", // If no, what is your work visa situation? (Text)
  "tt_answer_3522439": "$90,000 - $110,000",               // Salary Expectations (Text)

  // Custom Fields (candidate profile)
  "tt_custom_location": "Wellington",                      // Text
  "tt_custom_based-location": "New Zealand",               // Text
  "tt_custom_video-interview": "https://youtube.com/...",  // URL
  "tt_custom_websiteportfolio": "https://example.com/...", // URL
  "tt_custom_visa-sponsorship-required": "no",             // Checkbox (converts to false)
  "tt_custom_additional-notes": "From ManyChat integration", // Text

  // Notes (adds to activity timeline)
  "tt_notes": "**ManyChat Screening Summary**\\n\\n- Work Rights: Yes\\n- Location: Wellington"
}`}
            </CodeBlock>

            <p className="mt-3 text-sm text-zinc-500">
              Note: Comments shown above are for documentation only. Real JSON cannot contain comments.
            </p>
          </Section>

          <div className="mt-16 border-t border-zinc-200 pt-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
            Need help? Contact your administrator.
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-12 scroll-mt-8">
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
