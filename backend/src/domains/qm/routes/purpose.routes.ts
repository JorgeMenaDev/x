import { Elysia, t } from 'elysia'
import * as PurposeController from '../controllers/purpose.controller'

const app = new Elysia({ prefix: '/v1/qm/purpose' })

app
	.get('/', ({ query }) => PurposeController.getRecords({ query }), {
		query: t.Object({
			page: t.Optional(t.String()),
			limit: t.Optional(t.String())
		})
	})
	.post('/', ({ body }) => PurposeController.create({ body }), {
		body: t.Object({
			text: t.String()
		})
	})
	.put('/:id', ({ params, body }) => PurposeController.update({ params, body }), {
		params: t.Object({
			id: t.String()
		}),
		body: t.Object({
			text: t.String()
		})
	})
	.delete('/:id', ({ params }) => PurposeController.remove({ params }), {
		params: t.Object({
			id: t.String()
		})
	})

export default app
