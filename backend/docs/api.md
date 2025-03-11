# Model Reference Data API Documentation

## Overview

This document provides information about the API endpoints available for fetching model reference data from the backend.

## Base URL

All API endpoints are relative to the base URL of the backend server, which is typically:

```
http://localhost:8000/api
```

## Available Endpoints

### Get All Tables

Retrieves a list of all available tables in the database.

- **URL**: `/v1/inventory/tables`
- **Method**: `GET`
- **Response**: Array of table names

Example:

```json
{
	"success": true,
	"tables": [
		{
			"name": "qm_purpose",
			"schema": "public",
			"columns": [
				{
					"name": "id",
					"type": "integer",
					"nullable": true,
					"isPrimary": true
				},
				{
					"name": "text",
					"type": "text",
					"nullable": false,
					"isPrimary": false
				},
				{
					"name": "created_at",
					"type": "datetime",
					"nullable": true,
					"isPrimary": false
				},
				{
					"name": "updated_at",
					"type": "datetime",
					"nullable": true,
					"isPrimary": false
				}
			],
			"endpoints": {
				"get": "/api/v1/inventory/data/qm_purpose",
				"create": "/api/v1/inventory/data/qm_purpose",
				"update": "/api/v1/inventory/data/qm_purpose",
				"delete": "/api/v1/inventory/data/qm_purpose"
			}
		},
		{
			"name": "qm_model_type",
			"schema": "public",
			"columns": [
				{
					"name": "qm_type_id",
					"type": "integer",
					"nullable": true,
					"isPrimary": true
				},
				{
					"name": "qm_type",
					"type": "text",
					"nullable": false,
					"isPrimary": false
				},
				{
					"name": "created_at",
					"type": "datetime",
					"nullable": true,
					"isPrimary": false
				},
				{
					"name": "updated_at",
					"type": "datetime",
					"nullable": true,
					"isPrimary": false
				}
			],
			"endpoints": {
				"get": "/api/v1/inventory/data/qm_model_type",
				"create": "/api/v1/inventory/data/qm_model_type",
				"update": "/api/v1/inventory/data/qm_model_type",
				"delete": "/api/v1/inventory/data/qm_model_type"
			}
		},
		{
			"name": "qm_model_purpose",
			"schema": "public",
			"columns": [
				{
					"name": "purpose_id",
					"type": "integer",
					"nullable": true,
					"isPrimary": true
				},
				{
					"name": "purpose",
					"type": "text",
					"nullable": false,
					"isPrimary": false
				},
				{
					"name": "created_at",
					"type": "datetime",
					"nullable": true,
					"isPrimary": false
				},
				{
					"name": "updated_at",
					"type": "datetime",
					"nullable": true,
					"isPrimary": false
				}
			],
			"endpoints": {
				"get": "/api/v1/inventory/data/qm_model_purpose",
				"create": "/api/v1/inventory/data/qm_model_purpose",
				"update": "/api/v1/inventory/data/qm_model_purpose",
				"delete": "/api/v1/inventory/data/qm_model_purpose"
			}
		},
		{
			"name": "qm_uses",
			"schema": "public",
			"columns": [
				{
					"name": "use_id",
					"type": "integer",
					"nullable": true,
					"isPrimary": true
				},
				{
					"name": "use",
					"type": "text",
					"nullable": false,
					"isPrimary": false
				},
				{
					"name": "created_at",
					"type": "datetime",
					"nullable": true,
					"isPrimary": false
				},
				{
					"name": "updated_at",
					"type": "datetime",
					"nullable": true,
					"isPrimary": false
				}
			],
			"endpoints": {
				"get": "/api/v1/inventory/data/qm_uses",
				"create": "/api/v1/inventory/data/qm_uses",
				"update": "/api/v1/inventory/data/qm_uses",
				"delete": "/api/v1/inventory/data/qm_uses"
			}
		},
		{
			"name": "qm_asset_class",
			"schema": "public",
			"columns": [
				{
					"name": "assetclass_id",
					"type": "integer",
					"nullable": true,
					"isPrimary": true
				},
				{
					"name": "assetclass",
					"type": "text",
					"nullable": false,
					"isPrimary": false
				},
				{
					"name": "created_at",
					"type": "datetime",
					"nullable": true,
					"isPrimary": false
				},
				{
					"name": "updated_at",
					"type": "datetime",
					"nullable": true,
					"isPrimary": false
				}
			],
			"endpoints": {
				"get": "/api/v1/inventory/data/qm_asset_class",
				"create": "/api/v1/inventory/data/qm_asset_class",
				"update": "/api/v1/inventory/data/qm_asset_class",
				"delete": "/api/v1/inventory/data/qm_asset_class"
			}
		},
		{
			"name": "qm_subgroup",
			"schema": "public",
			"columns": [
				{
					"name": "subgroup_id",
					"type": "integer",
					"nullable": true,
					"isPrimary": true
				},
				{
					"name": "subgroup",
					"type": "text",
					"nullable": false,
					"isPrimary": false
				},
				{
					"name": "created_at",
					"type": "datetime",
					"nullable": true,
					"isPrimary": false
				},
				{
					"name": "updated_at",
					"type": "datetime",
					"nullable": true,
					"isPrimary": false
				}
			],
			"endpoints": {
				"get": "/api/v1/inventory/data/qm_subgroup",
				"create": "/api/v1/inventory/data/qm_subgroup",
				"update": "/api/v1/inventory/data/qm_subgroup",
				"delete": "/api/v1/inventory/data/qm_subgroup"
			}
		},
		{
			"name": "qm_purpose_to_use",
			"schema": "public",
			"columns": [
				{
					"name": "id",
					"type": "integer",
					"nullable": true,
					"isPrimary": true
				},
				{
					"name": "purpose_id",
					"type": "integer",
					"nullable": false,
					"isPrimary": false
				},
				{
					"name": "use_id",
					"type": "integer",
					"nullable": false,
					"isPrimary": false
				},
				{
					"name": "created_at",
					"type": "datetime",
					"nullable": true,
					"isPrimary": false
				},
				{
					"name": "updated_at",
					"type": "datetime",
					"nullable": true,
					"isPrimary": false
				}
			],
			"endpoints": {
				"get": "/api/v1/inventory/data/qm_purpose_to_use",
				"create": "/api/v1/inventory/data/qm_purpose_to_use",
				"update": "/api/v1/inventory/data/qm_purpose_to_use",
				"delete": "/api/v1/inventory/data/qm_purpose_to_use"
			}
		},
		{
			"name": "qm_subgroup_to_use",
			"schema": "public",
			"columns": [
				{
					"name": "id",
					"type": "integer",
					"nullable": true,
					"isPrimary": true
				},
				{
					"name": "subgroup_id",
					"type": "integer",
					"nullable": false,
					"isPrimary": false
				},
				{
					"name": "use_id",
					"type": "integer",
					"nullable": false,
					"isPrimary": false
				},
				{
					"name": "created_at",
					"type": "datetime",
					"nullable": true,
					"isPrimary": false
				},
				{
					"name": "updated_at",
					"type": "datetime",
					"nullable": true,
					"isPrimary": false
				}
			],
			"endpoints": {
				"get": "/api/v1/inventory/data/qm_subgroup_to_use",
				"create": "/api/v1/inventory/data/qm_subgroup_to_use",
				"update": "/api/v1/inventory/data/qm_subgroup_to_use",
				"delete": "/api/v1/inventory/data/qm_subgroup_to_use"
			}
		},
		{
			"name": "qm_purpose_to_asset_class",
			"schema": "public",
			"columns": [
				{
					"name": "id",
					"type": "integer",
					"nullable": true,
					"isPrimary": true
				},
				{
					"name": "purpose_id",
					"type": "integer",
					"nullable": false,
					"isPrimary": false
				},
				{
					"name": "assetclass_id",
					"type": "integer",
					"nullable": false,
					"isPrimary": false
				},
				{
					"name": "created_at",
					"type": "datetime",
					"nullable": true,
					"isPrimary": false
				},
				{
					"name": "updated_at",
					"type": "datetime",
					"nullable": true,
					"isPrimary": false
				}
			],
			"endpoints": {
				"get": "/api/v1/inventory/data/qm_purpose_to_asset_class",
				"create": "/api/v1/inventory/data/qm_purpose_to_asset_class",
				"update": "/api/v1/inventory/data/qm_purpose_to_asset_class",
				"delete": "/api/v1/inventory/data/qm_purpose_to_asset_class"
			}
		}
	]
}
```

### Get Table Data

Retrieves data from a specific table with optional pagination and filtering.

- **URL**: `/v1/inventory/data/:table_name`
- **Method**: `GET`
- **URL Parameters**:
  - `table_name`: Name of the table to fetch data from
- **Query Parameters**:
  - `page` (optional): Page number for pagination (default: 1)
  - `limit` (optional): Number of items per page (default: 10)
  - `filters` (optional): JSON string of filter conditions
  - `pause` (optional): Set to 'true' to pause data fetching

Example Request:

```
GET /api/v1/inventory/data/qm_model_type?page=1&limit=50
```

Example Response:

```json
{
	"data": [
		{
			"qm_type_id": 1,
			"qm_type": "Model",
			"created_at": "2023-06-15T10:30:00.000Z",
			"updated_at": "2023-06-15T10:30:00.000Z"
		},
		{
			"qm_type_id": 2,
			"qm_type": "DQM in scope",
			"created_at": "2023-06-15T10:30:00.000Z",
			"updated_at": "2023-06-15T10:30:00.000Z"
		}
	],
	"pagination": {
		"total": 4,
		"page": 1,
		"limit": 50,
		"totalPages": 1
	}
}
```

## Model Reference Data Tables

The following tables are available for model reference data:

1. `qm_model_type` - Contains model types

   - Fields: `qm_type_id`, `qm_type`

2. `qm_model_purpose` - Contains model purposes

   - Fields: `purpose_id`, `purpose`

3. `qm_uses` - Contains model uses

   - Fields: `use_id`, `use`

4. `qm_asset_class` - Contains asset classes

   - Fields: `assetclass_id`, `assetclass`

5. `qm_subgroup` - Contains subgroups

   - Fields: `subgroup_id`, `subgroup`

6. `qm_purpose_to_use` - Relationship between purposes and uses

   - Fields: `id`, `purpose_id`, `use_id`

7. `qm_subgroup_to_use` - Relationship between subgroups and uses

   - Fields: `id`, `subgroup_id`, `use_id`

8. `qm_purpose_to_asset_class` - Relationship between purposes and asset classes
   - Fields: `id`, `purpose_id`, `assetclass_id`

## Data Structure

The frontend expects the data in the following structure:

```json
{
	"QModelType": [
		{ "qm_type": "Model", "qm_type_id": 1 },
		{ "qm_type": "DQM in scope", "qm_type_id": 2 }
	],
	"QModelPurpose": [
		{ "purpose": "Credit", "purpose_id": 1 },
		{ "purpose": "Market", "purpose_id": 2 }
	],
	"Uses": [
		{ "use": "Capital", "use_id": 1 },
		{ "use": "Liq Management", "use_id": 2 }
	],
	"AssetClass": [
		{ "assetclass": "Rates", "assetclass_id": 1 },
		{ "assetclass": "Equity", "assetclass_id": 2 }
	],
	"Subgroup": [
		{ "subgroup": "SG1", "subgroup_id": 1 },
		{ "subgroup": "SG2", "subgroup_id": 2 }
	],
	"model_reference_data_level2": {
		"PurposeToUse": [
			{ "purpose_id": 1, "use_id": 1 },
			{ "purpose_id": 2, "use_id": 1 }
		],
		"SubgroupToUse": [
			{ "subgroup_id": 1, "use_id": 1 },
			{ "subgroup_id": 2, "use_id": 3 }
		],
		"PurposeToAssetClass": [
			{ "purpose_id": 1, "assetclass_id": 2 },
			{ "purpose_id": 2, "assetclass_id": 1 }
		]
	}
}
```

## Fetching Strategy

To match the expected data structure, you'll need to:

1. Fetch data from each table separately
2. Transform the data to match the expected structure
3. Combine the data into a single object

Example transformation for `qm_model_type` to `QModelType`:

```javascript
const response = await fetch('/api/v1/inventory/data/qm_model_type?limit=100')
const data = await response.json()
const QModelType = data.data.map(item => ({
	qm_type: item.qm_type,
	qm_type_id: item.qm_type_id
}))
```
