import { Elysia, t } from 'elysia'
import {
	getLowInventory,
	getTables,
	getTableData,
	createTableRow,
	updateTableRow,
	deleteTableRow
} from '../controllers/inventory_controller'

const app = new Elysia({ prefix: '/v1/inventory' })

// Inventory endpoints
app.get('/low', getLowInventory)

// Tables endpoints
app.get('/tables', getTables)

// New data endpoints with RESTful structure
app.group('/data', app =>
	app
		.get('/:table_name', ({ params, query }) => getTableData({ params, query }), {
			params: t.Object({
				table_name: t.String()
			}),
			query: t.Object({
				page: t.Optional(t.String()),
				limit: t.Optional(t.String()),
				filters: t.Optional(t.String()),
				pause: t.Optional(t.String())
			})
		})
		.post('/:table_name', ({ params, body }) => createTableRow({ params, body }), {
			params: t.Object({
				table_name: t.String()
			}),
			body: t.Object({
				id: t.Optional(t.String()),
				data: t.Object({}, { additionalProperties: true })
			})
		})
		.put('/:table_name', ({ params, body }) => updateTableRow({ params, body }), {
			params: t.Object({
				table_name: t.String()
			}),
			body: t.Object({
				id: t.String(),
				data: t.Object({}, { additionalProperties: true })
			})
		})
		.delete('/:table_name', ({ params, body }) => deleteTableRow({ params, body }), {
			params: t.Object({
				table_name: t.String()
			}),
			body: t.Object({
				id: t.String()
			})
		})
)

export default app
