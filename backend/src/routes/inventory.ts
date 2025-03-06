import { Elysia, t } from 'elysia'
import {
	getLowInventory,
	getTables,
	getQmPurposeRecords,
	createQmPurposeRecord,
	updateQmPurposeRecord,
	deleteQmPurposeRecord
} from '../controllers/inventory_controller'

const app = new Elysia({ prefix: '/v1/inventory' })

// Inventory endpoints
app.get('/low', getLowInventory)

// Tables endpoints
app.get('/tables', getTables)

app.group('/tables', app =>
	app.group('/qm_purpose', app =>
		app
			.get('/', ({ query }) => getQmPurposeRecords({ query }), {
				query: t.Object({
					page: t.Optional(t.String()),
					limit: t.Optional(t.String())
				})
			})
			.post('/', ({ body }) => createQmPurposeRecord({ body }), {
				body: t.Object({
					text: t.String()
				})
			})
			.put('/:id', ({ params, body }) => updateQmPurposeRecord({ params, body }), {
				params: t.Object({
					id: t.String()
				}),
				body: t.Object({
					text: t.String()
				})
			})
			.delete('/:id', ({ params }) => deleteQmPurposeRecord({ params }), {
				params: t.Object({
					id: t.String()
				})
			})
	)
)

export default app
