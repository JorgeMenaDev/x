import { Elysia } from 'elysia'
import { InventoryController } from '../controllers/inventory_controller'

const inventoryController = new InventoryController()

const inventoryRoutes = new Elysia().group('/v1/inventory', app =>
	app
		.get('/tables', () => inventoryController.getTables())
		.group('/data', app =>
			app
				.get('/:table_name', context => inventoryController.getTableData(context))
				.post('/:table_name', context => inventoryController.createTableRow(context))
				.put('/:table_name', context => inventoryController.updateTableRow(context))
				.delete('/:table_name', context => inventoryController.deleteTableRow(context))
		)
)

export default inventoryRoutes
