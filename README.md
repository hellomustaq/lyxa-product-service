# Product Service

NestJS service that provides product CRUD. Create, list, get, update, and delete products. Protected routes (create, update, delete) require a valid Bearer token; the token is validated by calling the auth-service over RabbitMQ. Only the product owner can update or delete a product.

## What it does

- **Products**: Stored in MongoDB via Typegoose (name, description, price, ownerId). Each product has an owner (user id from auth-service).
- **CRUD**: Create product (owner set from token), list all, get one, update one, delete one.
- **Auth**: Before create/update/delete, the service sends an RMQ request to auth-service (`auth.validate-token`) with the Bearer token. If valid, the user id is used as owner on create and enforced on update/delete (only owner can update/delete).
- **Events**: Listens for `user.created` on RabbitMQ and logs it (no persistence).

## Prerequisites

- Node.js (v18+)
- MongoDB (e.g. `mongodb://localhost:27017`)
- RabbitMQ (e.g. `amqp://guest:guest@localhost:5672`)
- Auth-service running (for token validation and correct queue names)

## Setup

1. **Install dependencies**

   ```bash
   npm install --legacy-peer-deps
   ```

2. **Environment**

   Copy the example env and set your values:

   ```bash
   cp .env.example .env
   ```

   Edit `.env`. Main variables:

   | Variable | Description |
   |----------|-------------|
   | `PRODUCT_PORT` | HTTP port (default `3001`) |
   | `PRODUCT_MONGO_URI` | MongoDB connection string |
   | `RABBITMQ_URL` | RabbitMQ connection URL |
   | `RABBITMQ_AUTH_QUEUE` | Same queue as auth-service uses for token RPC |
   | `RABBITMQ_USER_EVENTS_QUEUE` | Queue where auth-service emits `user.created` |

3. **Build**

   ```bash
   npm run build
   ```

## Run

```bash
# Development (watch mode)
npm run start:dev

# Production
npm run start:prod
```

Default HTTP port: `3001` (or `PRODUCT_PORT` from `.env`).

## HTTP endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/products` | Bearer | Create product (body: name, description?, price). Owner = user from token. |
| `GET` | `/products` | No | List all products |
| `GET` | `/products/:id` | No | Get one product |
| `PATCH` | `/products/:id` | Bearer | Update product (owner only). Body: name?, description?, price? |
| `DELETE` | `/products/:id` | Bearer | Delete product (owner only) |

Protected routes require header: `Authorization: Bearer <access_token>` (token issued by auth-service).

## RabbitMQ

- **Client**: Sends `auth.validate-token` RPC to `RABBITMQ_AUTH_QUEUE` (auth-service) to validate the Bearer token and get userId, email, role.
- **Server**: Listens on `RABBITMQ_USER_EVENTS_QUEUE` for event `user.created` and logs the payload.

## Scripts

- `npm run build` – Compile
- `npm run start` – Run once
- `npm run start:dev` – Run in watch mode
- `npm run start:prod` – Run compiled (e.g. `node dist/main`)
- `npm run lint` – Lint
- `npm run test` – Unit tests
