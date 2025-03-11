import { Context } from 'elysia'
import { InventoryRepository } from '../db/inventory_repository'

export class InventoryController {
	private inventoryRepo: InventoryRepository

	constructor() {
		this.inventoryRepo = new InventoryRepository()
	}

	async getTables() {
		try {
			return await this.inventoryRepo.getTables()
		} catch (error) {
			return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 })
		}
	}

	async getTableData({ params, query }: Context) {
		const { table_name } = params
		const { page = '1', limit = '10', filters, pause } = query as Record<string, string>

		try {
			const parsedFilters = filters ? JSON.parse(filters) : {}
			const data = await this.inventoryRepo.fetchTableData(
				table_name,
				Number(page),
				Number(limit),
				parsedFilters,
				pause === 'true'
			)
			return data
		} catch (error) {
			return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 })
		}
	}

	async createTableRow({ params, body }: Context) {
		const { table_name } = params
		const { id, data } = body as { id?: string; data: Record<string, any> }
		try {
			const rowId = await this.inventoryRepo.createRow(table_name, { id, ...data })
			return new Response(JSON.stringify({ id: rowId }), { status: 201 })
		} catch (error) {
			return new Response(JSON.stringify({ error: (error as Error).message }), { status: 400 })
		}
	}

	async updateTableRow({ params, body }: Context) {
		const { table_name } = params
		const { id, data } = body as { id: string; data: Record<string, any> }

		if (!id) return new Response(JSON.stringify({ error: 'ID is required for update' }), { status: 400 })
		if (!data || Object.keys(data).length === 0) {
			return new Response(JSON.stringify({ error: 'No data provided for update' }), { status: 400 })
		}

		try {
			await this.inventoryRepo.updateRow(table_name, id, data)
			return new Response(JSON.stringify({ message: 'Row updated' }), { status: 200 })
		} catch (error) {
			return new Response(JSON.stringify({ error: (error as Error).message }), { status: 400 })
		}
	}

	async deleteTableRow({ params, body }: Context) {
		const { table_name } = params
		const { id } = body as { id: string }

		if (!id) return new Response(JSON.stringify({ error: 'ID is required for deletion' }), { status: 400 })

		try {
			await this.inventoryRepo.deleteRow(table_name, id)
			return new Response(null, { status: 204 })
		} catch (error) {
			return new Response(JSON.stringify({ error: (error as Error).message }), { status: 400 })
		}
	}
}
