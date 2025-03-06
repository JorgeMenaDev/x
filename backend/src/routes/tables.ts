import { Elysia, t } from 'elysia'
import {
	getTableRecords,
	createTableRecord,
	updateTableRecord,
	deleteTableRecord
} from '../controllers/tables_controller'

const app = new Elysia({ prefix: '/v1/tables' })

app
	.get('/:table', ({ params, query }) => getTableRecords({ params, query }), {
		params: t.Object({
			table: t.String()
		}),
		query: t.Object({
			page: t.Optional(t.String()),
			limit: t.Optional(t.String())
		})
	})
	.post('/:table', ({ params, body }) => createTableRecord({ params, body }), {
		params: t.Object({
			table: t.String()
		}),
		body: t.Object({}) // Allow any object as body
	})
	.put('/:table/:id', ({ params, body }) => updateTableRecord({ params, body }), {
		params: t.Object({
			table: t.String(),
			id: t.String()
		}),
		body: t.Object({}, { additionalProperties: true }) // allow any fields
	})
	.delete('/:table/:id', ({ params }) => deleteTableRecord({ params }), {
		params: t.Object({
			table: t.String(),
			id: t.String()
		})
	})

export default app
