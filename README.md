# Ticket API

A RESTful API for managing tickets, built with Node.js, Express, MySQL, Prisma ORM, and RabbitMQ.

## Features

- Create, read, update, and delete tickets
- Ticket status management (`open`, `pending`, `closed`)
- Publishes ticket events to RabbitMQ
- Health check endpoint
- Outbox pattern for reliable event publishing
- Choreography saga for publishing ticket lifecycle events

## Tech Stack

- **Runtime:** Node.js v24+
- **Framework:** Express.js
- **Database:** MySQL 8.0
- **ORM:** Prisma
- **Message Queue:** RabbitMQ
- **Language:** TypeScript

## Prerequisites

- Docker (for dev container with MySQL, Prisma, and RabbitMQ)
- VS Code with Dev Containers extension
- Or: Node.js v24+, npm, MySQL, and RabbitMQ locally installed

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

Open the project in VS Code and use the **Dev Containers** extension to reopen in the dev container. This will start MySQL and RabbitMQ automatically and set up the development environment.

First-time setup:

```sh
npm install
npx prisma migrate deploy  # or prisma migrate dev for dev mode
```

### 5. Start the API

```sh
npm start
```

The API will be available at `http://localhost:3000`.

### Local Development (without Dev Container)

If running locally without Docker:

```sh
# Install dependencies
npm install

# Set up database
DATABASE_URL="mysql://user:password@localhost:3306/tickets_dev" npx prisma migrate deploy

# Start dev server
npm run dev
```

## Database Migrations

Prisma migrations are stored in `/prisma/migrations/`.

- **Create new migration (dev):** `npm run db:migrate:dev`
- **Apply migrations (production):** `npm run db:migrate`
- **Generate Prisma client:** `npx prisma generate`

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
- `src/infrastructure/db/prisma/` – Prisma schema, client, connections, and repositories
- `src/infrastructure/messaging/` – RabbitMQ config and event bus implementation
- `src/presentation/http/` – Express config, controllers, errors, middleware, routes, validation
- `src/workers/` – Background worker (outbox event publisher)
- `prisma/` – Prisma schema and migration files
- `tests/` – Integration/functional tests

## Architecture

This project follows **Domain-Driven Design (DDD)** and **Hexagonal Architecture** principles:

- **Domain Layer** (`src/domain/`) – Core business logic, independent of infrastructure
- **Application Layer** (`src/application/`) – Use cases and business rules
- **Infrastructure Layer** (`src/infrastructure/`) – Database, messaging, external services
- **Presentation Layer** (`src/presentation/`) – HTTP controllers and routes

The **Outbox Pattern** ensures reliable event publishing:

1. When a ticket is created/updated/deleted, an outbox event is persisted with the ticket in a transaction
2. A background worker continuously polls pending outbox events
3. Published events are marked as completed and can be archived

The **Choreography Saga** publishes ticket lifecycle events for other services:

1. Ticket create/update/delete use cases mutate the local Ticket aggregate
2. `TicketLifecycleChoreographySaga` records the corresponding integration event in the outbox in the same database transaction
3. The outbox worker publishes those events to RabbitMQ so services like Notification API can react independently

## License

MIT
