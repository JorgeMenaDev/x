import { Elysia } from 'elysia'
import { InventoryController } from '../controllers/inventory_controller'

const inventoryController = new InventoryController()

const inventoryRoutes = new Elysia().group('/v1/inventory', app =>
	app
		.get('/tables', inventoryController.getTables)
		.group('/data', app =>
			app
				.get('/:table_name', inventoryController.getTableData)
				.post('/:table_name', inventoryController.createTableRow)
				.put('/:table_name', inventoryController.updateTableRow)
				.delete('/:table_name', inventoryController.deleteTableRow)
		)
)

export default inventoryRoutes
