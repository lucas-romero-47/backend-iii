# Backend III — Entrega Final

API REST built with Express + Mongoose for managing users, pets, and adoptions. Includes mocking utilities for data generation.

## Docker Image

**DockerHub**: [lucasromero47/backend-iii](https://hub.docker.com/r/lucasromero47/backend-iii)

```bash
docker pull lucasromero47/backend-iii
```

## Running Locally

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)

### Setup

```bash
npm install
```

Create a `.env` file:

```
PORT=8080
MONGO_URL=mongodb://localhost:27017/backend3
```

### Start

```bash
npm run dev
```

The server will start at `http://localhost:8080`.

## Running with Docker

### Build the image

```bash
docker build -t backend-iii .
```

### Run the container

```bash
docker run -e MONGO_URL=<your-mongo-url> -p 8080:8080 backend-iii
```

## API Documentation

Swagger UI is available at `http://localhost:8080/api-docs` when the server is running.

## API Endpoints

### Users

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/users` | Get all users |

### Pets

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/pets` | Get all pets |

### Adoptions

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/adoptions` | Get all adoptions |
| GET | `/api/adoptions/:aid` | Get adoption by ID |
| POST | `/api/adoptions/:uid/:pid` | Create adoption (user adopts pet) |
| DELETE | `/api/adoptions/:aid` | Revert adoption |

### Mocks

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/mocks/mockingpets` | Generate mock pets |
| GET | `/api/mocks/mockingusers` | Generate 50 mock users |
| POST | `/api/mocks/generateData` | Generate and insert mock data |

## Running Tests

```bash
npm test
```

Tests cover all endpoints of the `adoption.router.js` using Mocha, Chai, and Supertest.
