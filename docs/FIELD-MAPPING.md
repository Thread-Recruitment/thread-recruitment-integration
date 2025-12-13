# Field Mapping

ManyChat fields use `tt_` prefix to indicate TeamTailor destination.

## Candidate Fields

| ManyChat Field | TeamTailor Field | Required |
|----------------|------------------|----------|
| `tt_email` | Candidate email | Yes |
| `tt_first_name` | Candidate first name | No |
| `tt_last_name` | Candidate last name | No |
| `tt_phone` | Candidate phone | No |
| `tt_tags` | Candidate tags | No |

Tags are comma-separated: `"ManyChat,Summer2025,Auckland"`

## Answer Fields

Format: `tt_answer_{questionId}`

Example:
```json
{
  "tt_answer_12345": "Yes",
  "tt_answer_12346": "Auckland",
  "tt_answer_12347": "3"
}
```

Answer values are automatically detected:
- `"yes"`, `"true"` -> Boolean true
- `"no"`, `"false"` -> Boolean false
- `"1,2,3"` -> Multiple choice IDs
- Other -> Text

## Custom Field Values

Format: `tt_custom_{apiName}`

The `apiName` must match the custom field's API name in TeamTailor.

Example:
```json
{
  "tt_custom_source": "Instagram",
  "tt_custom_region": "Auckland"
}
```

## Notes

`tt_notes` creates a note on the candidate profile. Supports markdown.

```json
{
  "tt_notes": "**Summary**\n- Passed screening\n- Available immediately"
}
```
