import { requireEnv, teamtailor } from './lib'

async function main() {
  requireEnv()

  console.log('\nFetching custom fields...')

  try {
    const fields = await teamtailor.getCustomFields()

    console.log(`\n✓ Found ${fields.length} custom fields:\n`)

    for (const f of fields) {
      console.log(`  [${f.id}] ${f.attributes.name} (api-name: ${f.attributes['api-name']}, type: ${f.attributes['field-type']})`)
    }
  } catch (error) {
    console.error('\n❌ Failed to fetch custom fields:', error)
    process.exit(1)
  }
}

main()
