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

To find question IDs, run:
```bash
npx tsx scripts/test-get-questions.ts
```

To verify your setup is correct, look for:
- **"Do you have permanent work rights?"** - ID **3165763**

Example:
```json
{
  "tt_answer_3165763": "Yes",
  "tt_answer_12346": "Auckland",
  "tt_answer_12347": "3"
}
```

Answer values are automatically converted based on the TeamTailor question type. See [Type Conversion](#type-conversion) for details.

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

> **Tip:** When creating custom fields in ManyChat, use the **Description** field to document what question this field represents. This helps admins understand the mapping when reviewing the flow later.

## Notes

`tt_notes` creates a note on the candidate profile. Supports markdown.

```json
{
  "tt_notes": "**Summary**\n- Passed screening\n- Available immediately"
}
```

## Type Conversion

The integration automatically converts values from ManyChat to the format TeamTailor expects. You can use any ManyChat field type (Text, Number, Date, Boolean, Array) - the integration normalizes everything and converts based on the target field type in TeamTailor.

### ManyChat Input Types

| ManyChat Type | How It's Normalized |
|---------------|---------------------|
| Text | Passed as-is |
| Number | Converted to string (`123` → `"123"`) |
| Date / DateTime | Passed as-is (ISO format) |
| True/False | Converted to `"true"` / `"false"` |
| Array | Joined with commas (`["a","b"]` → `"a,b"`) |

### TeamTailor Question Types

| TT Question Type | Input Examples | Conversion |
|------------------|----------------|------------|
| Text | `"Auckland"` | Passed as text |
| Boolean | `"yes"`, `"true"`, `"1"`, `"on"` | Converted to `true`; anything else is `false` |
| Number | `"5"`, `"3.5"` | Parsed as number; falls back to text if invalid |
| Video | `"https://..."` | Passed as text (URL) |
| Choice | `"42"` or `"1,2,3"` | Parsed as choice ID(s) |

### TeamTailor Custom Field Types

| TT Field Type | Input Examples | Conversion |
|---------------|----------------|------------|
| Text | `"Auckland"` | Passed as-is |
| URL | `"https://..."` | Passed as-is |
| Checkbox | `"yes"`, `"true"`, `"1"` | Converted to `"true"`; anything else is `"false"` |
| Number | `"42"`, `"3.14"` | Parsed as number string |
| Date | `"2024-01-15"` | Passed as-is (use ISO format) |
| Select / MultiSelect | `"option_id"` | Passed as-is |

### Best Practices

1. **Use Text fields in ManyChat** when in doubt - they work with any TeamTailor type
2. **For Boolean questions**, any of these values work: `yes`, `true`, `1`, `on` (case-insensitive)
3. **For Number questions**, ensure the ManyChat field contains a valid number
4. **For Choice questions**, use the choice ID from TeamTailor (run `npx tsx scripts/test-get-questions.ts` to see choice IDs)

### Error Handling

If a value can't be converted (e.g., `"banana"` for a Number field), the integration will:
- Log a warning
- Fall back to sending the raw value as text
- Continue processing other fields

This ensures partial data is still synced even if some fields have conversion issues.
