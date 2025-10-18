# Ticket API

A RESTful API for managing tickets, built with Node.js, Express, MongoDB, and RabbitMQ.

## Features

- Create, read, update, and delete tickets
- Ticket status management (`open`, `pending`, `closed`)
- Publishes ticket events to RabbitMQ
- Health check endpoint

## Prerequisites

- Node.js (v14+)
- npm
- Docker (for MongoDB and RabbitMQ via devcontainer)

## Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/lauriselvijs/ticket-api.git
cd ticket-api
```

### 2. Install dependencies

```sh
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in the required values:

```sh
cp .env.example .env
```

### 4. Run with Dev Container (Recommended)

Open the project in VS Code and reopen in the dev container. This will start MongoDB and RabbitMQ automatically.

### 5. Start the API

```sh
npm start
```

The API will be available at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| GET    | `/api/v1/health`      | Health check        |
| GET    | `/api/v1/tickets`     | List all tickets    |
| POST   | `/api/v1/tickets`     | Create a new ticket |
| GET    | `/api/v1/tickets/:id` | Get ticket by ID    |
| PUT    | `/api/v1/tickets/:id` | Update ticket       |
| DELETE | `/api/v1/tickets/:id` | Delete ticket       |

## Project Structure

- `src/controllers/` – Route handlers
- `src/models/` – Mongoose models
- `src/routes/` – Express route definitions
- `src/middleware/` – Express middleware
- `src/config/` – Configuration for Express, MongoDB, RabbitMQ
- `src/schemas/` – Zod validation schemas
- `src/enums/` – Enums for ticket status and routing keys
- `src/util/` – Utility functions

## License

MIT
