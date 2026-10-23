import 'dotenv/config'
import pg from 'pg'

const { Client } = pg

async function compare() {
  const localUri = process.env.LOCAL_DB || process.env.DATABASE_URI || 'postgresql://postgres:admin123@localhost:5432/atidi'
  const remoteUri = process.env.REMOTE_DB

  if (!remoteUri) {
    console.error('\n❌ ERROR: Please provide the other database connection string!')
    console.log('Run like this in PowerShell:')
    console.log('$env:REMOTE_DB="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"')
    console.log('npx tsx scripts/compare-databases.ts\n')
    process.exit(1)
  }

  console.log('========================================================================')
  console.log('               DATABASE SIDE-BY-SIDE COMPARISON REPORT                  ')
  console.log('========================================================================')
  console.log('Database 1 (Localhost):', localUri.replace(/:[^:@]+@/, ':***@'))
  console.log('Database 2 (Other DB): ', remoteUri.replace(/:[^:@]+@/, ':***@'))
  console.log('------------------------------------------------------------------------\n')

  const localClient = new Client({ connectionString: localUri })
  const remoteClient = new Client({ connectionString: remoteUri })

  try {
    await localClient.connect()
    console.log('✅ Connected to Localhost Database')
  } catch (e: any) {
    console.error('❌ Failed to connect to Localhost DB:', e.message)
    process.exit(1)
  }

  try {
    await remoteClient.connect()
    console.log('✅ Connected to Other Database')
  } catch (e: any) {
    console.error('❌ Failed to connect to Other DB:', e.message)
    await localClient.end()
    process.exit(1)
  }

  // 1. Compare Tables
  console.log('\n[1/3] COMPARING TABLES...')
  console.log('------------------------------------------------------------------------')

  const getTables = async (client: any) => {
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `)
    return new Set<string>(res.rows.map((r: any) => r.table_name))
  }

  const localTables = await getTables(localClient)
  const remoteTables = await getTables(remoteClient)

  console.log(`Localhost Total Tables: ${localTables.size}`)
  console.log(`Other DB  Total Tables: ${remoteTables.size}`)

  const missingInRemoteTables: string[] = []
  for (const t of localTables) {
    if (!remoteTables.has(t)) {
      missingInRemoteTables.push(t)
    }
  }

  if (missingInRemoteTables.length > 0) {
    console.log(`\n❌ TABLES MISSING IN OTHER DATABASE (${missingInRemoteTables.length}):`)
    missingInRemoteTables.forEach(t => console.log(`   - ${t}`))
  } else {
    console.log('\n✅ All tables in Localhost also exist in the other database!')
  }

  // 2. Compare Columns for Every Table
  console.log('\n[2/3] COMPARING COLUMNS IN EACH TABLE...')
  console.log('------------------------------------------------------------------------')

  const getColumns = async (client: any, table: string) => {
    const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = $1
    `, [table])
    const map = new Map<string, string>()
    res.rows.forEach((r: any) => map.set(r.column_name, r.data_type))
    return map
  }

  let columnDifferencesFound = 0
  const commonTables = Array.from(localTables).filter(t => remoteTables.has(t)).sort()

  for (const table of commonTables) {
    const localCols = await getColumns(localClient, table)
    const remoteCols = await getColumns(remoteClient, table)

    const missingInRemoteCols: string[] = []
    for (const [colName] of localCols) {
      if (!remoteCols.has(colName)) {
        missingInRemoteCols.push(colName)
      }
    }

    if (missingInRemoteCols.length > 0) {
      columnDifferencesFound += missingInRemoteCols.length
      console.log(`⚠️ Table "${table}": ❌ MISSING COLUMNS in Other DB: [ ${missingInRemoteCols.join(', ')} ]`)
    }
  }

  if (columnDifferencesFound === 0) {
    console.log('✅ All columns match 100% across all shared tables!')
  }

  // 3. Compare Row Counts
  console.log('\n[3/3] COMPARING ROW COUNTS IN KEY COLLECTIONS...')
  console.log('------------------------------------------------------------------------')
  console.log(
    'Table Name'.padEnd(25) +
    'Localhost Rows'.padEnd(20) +
    'Other DB Rows'.padEnd(20) +
    'Status'
  )
  console.log(''.padEnd(72, '-'))

  const checkList = [
    'users',
    'pages',
    'treatments',
    'locations',
    'clinics',
    'categories',
    'faqs',
    'testimonials',
    'posts',
    'site_settings',
    'navigation',
    'footer',
  ]

  for (const table of checkList) {
    const getCount = async (client: any) => {
      try {
        const res = await client.query(`SELECT COUNT(*) FROM "${table}"`)
        return parseInt(res.rows[0].count, 10)
      } catch {
        return -1
      }
    }

    const localCount = await getCount(localClient)
    const remoteCount = await getCount(remoteClient)

    let status = 'MATCH'
    if (remoteCount === -1) {
      status = 'TABLE MISSING'
    } else if (localCount !== remoteCount) {
      status = `DIFF (${remoteCount - localCount > 0 ? '+' : ''}${remoteCount - localCount})`
    }

    console.log(
      table.padEnd(25) +
      String(localCount).padEnd(20) +
      (remoteCount === -1 ? 'MISSING' : String(remoteCount)).padEnd(20) +
      (status === 'MATCH' ? '✅ MATCH' : `⚠️ ${status}`)
    )
  }

  console.log('\n========================================================================')
  console.log('                         COMPARISON COMPLETE                            ')
  console.log('========================================================================\n')

  await localClient.end()
  await remoteClient.end()
}

compare().catch(console.error)

