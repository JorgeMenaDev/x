import { resetAndSeedDatabase } from './database'

// Reset and seed the database
console.log('Resetting and seeding database...')
const result = resetAndSeedDatabase()
console.log('Database reset and seeded:', result)

// Exit the process
process.exit(0)
