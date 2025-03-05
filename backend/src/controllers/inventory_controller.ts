import { getDB } from '../db/database.ts'

// Get low inventory products
export async function getLowInventory(ctx) {
	const db = getDB()
	const query = `
    SELECT * FROM products
    WHERE quantity <= min_quantity
    ORDER BY quantity ASC
  `
	const lowInventory = db.queryEntries(query)

	ctx.response.body = {
		success: true,
		data: lowInventory
	}
}
