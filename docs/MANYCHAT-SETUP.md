# ManyChat Setup

## External Request Configuration

1. In your ManyChat flow, add an "External Request" action
2. Set method to POST
3. Set URL to your webhook endpoint:
   ```
   https://your-domain.vercel.app/api/webhook/YOUR_SECRET?job_id=12345
   ```
4. Set Content-Type header to `application/json`
5. Configure the JSON body

## JSON Body Template

```json
{
  "tt_email": "{{email}}",
  "tt_first_name": "{{first_name}}",
  "tt_last_name": "{{last_name}}",
  "tt_phone": "{{phone}}",
  "tt_tags": "ManyChat",
  "tt_answer_12345": "{{custom_field_answer1}}",
  "tt_notes": "{{custom_field_summary}}"
}
```

Replace:
- `{{email}}`, `{{first_name}}`, etc. with ManyChat system fields
- `{{custom_field_*}}` with your custom user fields
- `12345` with your TeamTailor question IDs

## Field Encoding

Enable "Encode to JSON" on each field to handle special characters properly.

## Response Handling

Success response:
```json
{
  "success": true,
  "candidate_id": "123456"
}
```

Use response mapping to save `candidate_id` to a custom field if needed.

## Multiple Jobs

Create separate External Request actions for different jobs, each with its own `job_id` query parameter.
