# Backend API

A modern, fast backend API built with Bun and Elysia.js for inventory management.

## 🚀 Features

- Built with Bun - ultra-fast JavaScript runtime and toolkit
- Elysia.js for routing and middleware
- SQLite database with built-in support from Bun
- TypeScript support out of the box
- Docker support
- Environment configuration
- CORS enabled
- Health check endpoint
- Request logging
- Error handling

## 📋 Prerequisites

- [Bun](https://bun.sh) (v1.0.30 or higher)
- Docker (optional, for containerized development)

## 🛠 Installation

1. Install Bun (if not already installed):

```bash
curl -fsSL https://bun.sh/install | bash
```

2. Clone the repository:

```bash
git clone <your-repo-url>
cd backend
```

3. Install dependencies:

```bash
bun install
```

4. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your configuration.

## 🚀 Running the Application

### Development Mode

```bash
bun run dev
```

This will start the server in development mode with hot reloading.

### Production Mode

```bash
bun run start
```

### Using Docker

```bash
docker-compose up
```

## 🔧 Environment Variables

| Variable        | Description          | Default |
| --------------- | -------------------- | ------- |
| PORT            | Server port          | 8000    |
| ALLOWED_ORIGINS | CORS allowed origins | \*      |

## 📝 API Endpoints

### Health Check

- GET `/api/health` - Check API health status

### Inventory Management

- GET `/api/v1/inventory/tables` - Get all tables in the database
- GET `/api/v1/inventory/data/:table_name` - Get data from a specific table with pagination, filtering, and pause options
- POST `/api/v1/inventory/data/:table_name` - Create a new row in a specific table
- PUT `/api/v1/inventory/data/:table_name` - Update a row in a specific table
- DELETE `/api/v1/inventory/data/:table_name` - Delete a row from a specific table

### Database Seeding

- GET `/api/seed/` - Seed the database with initial data
- GET `/api/seed/reset` - Reset and reseed the database (drops existing tables)

## Query Parameters

### For GET `/api/v1/inventory/data/:table_name`

- `page` (default: 1) - Page number for pagination
- `limit` (default: 10) - Number of items per page
- `filters` (optional) - JSON string of filter conditions
- `pause` (optional) - Set to 'true' to pause data fetching

## Request Body Examples

### POST `/api/v1/inventory/data/:table_name`

```json
{
	"id": "optional-custom-id",
	"data": {
		"field1": "value1",
		"field2": "value2"
	}
}
```

### PUT `/api/v1/inventory/data/:table_name`

```json
{
	"id": "row-id-to-update",
	"data": {
		"field1": "new-value1",
		"field2": "new-value2"
	}
}
```

### DELETE `/api/v1/inventory/data/:table_name`

```json
{
	"id": "row-id-to-delete"
}
```

## 🧪 Testing

Run tests:

```bash
bun test
```

## 🐳 Docker Support

Build and run with Docker:

```bash
# Build the image
docker build -t backend-api .

# Run the container
docker run -p 8000:8000 backend-api
```

Or use docker-compose:

```bash
docker-compose up
```

## 📦 Project Structure

```
.
├── src/
│   ├── controllers/   # Request handlers
│   ├── routes/        # API routes
│   ├── db/            # Database related files
│   ├── lib/           # Utility functions and helpers
│   └── server.ts      # Main application file
├── data/              # SQLite database
├── .env               # Environment variables
├── .env.example       # Example environment file
├── package.json       # Dependencies and scripts
├── tsconfig.json      # TypeScript configuration
├── Dockerfile         # Docker configuration
└── docker-compose.yml # Docker Compose configuration
```

## Troubleshooting

### Common Issues

1. **"undefined is not an object (evaluating 'this.inventoryRepo')"**

   - This error occurs when the `this` context is lost in route handlers. Make sure route handlers are wrapped in arrow functions to preserve the context.

2. **Database Connection Issues**

   - Ensure the database file path is correct in the InventoryRepository constructor
   - Check file permissions for the database file

3. **CORS Issues**
   - Verify that your frontend origin is included in the ALLOWED_ORIGINS environment variable
   - For development, you can set ALLOWED_ORIGINS=\* to allow all origins

## Development Notes

- The API uses a dynamic approach to handle any table in the SQLite database
- Primary keys are expected to be named 'id' for update and delete operations
- All database operations are performed using Bun's built-in SQLite support

## License

[MIT License](LICENSE)

## API Documentation

_Make sure to run the following commands to make the data directory and database file writable_

```
cd backend && chmod 755 data && chmod 644 data/database.sqlite
```
