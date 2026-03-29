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

- `src/app.ts` – Application and server bootstrap
- `src/index.ts` – Entry point
- `src/container.ts` – Dependency injection / app wiring
- `src/application/dtos/` – Data transfer objects
- `src/application/enums/` – Aggregate and outbox status enums
- `src/application/errors/` – Custom error types
- `src/application/events/` – Domain integration/outbox event models
- `src/application/ports/` – Interfaces (DbConnection, EventBus, OutboxRepository, etc.)
- `src/application/use-cases/` – Business use cases (CRUD + outbox event publish)
- `src/domain/ticket/entities/` – Ticket domain entity
- `src/domain/ticket/enums/` – Ticket status/event type enums
- `src/domain/ticket/repositories/` – Ticket repository interface
- `src/domain/ticket/types/` – Ticket domain types
- `src/infrastructure/messaging/` – RabbitMQ config and event bus implementation
- `src/infrastructure/persistence/mongo/` – MongoDB config, models, schemas, mappers
- `src/infrastructure/repositories/` – MongoDB repositories
- `src/presentation/http/` – Express config, controllers, errors, middleware, routes, validation
- `src/workers/` – Background worker (outbox event publisher)
- `tests/` – Integration/functional tests

## License

MIT
