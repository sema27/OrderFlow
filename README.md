# 📦 OrderFlow

> Distributed e-commerce order management system built with **.NET 8**, **Clean Architecture**, **RabbitMQ**, and **PostgreSQL**.

![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=flat-square&logo=dotnet)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-MassTransit-FF6600?style=flat-square&logo=rabbitmq)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?style=flat-square&logo=postgresql)
![React](https://img.shields.io/badge/React-Vite-61DAFB?style=flat-square&logo=react)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker)

---

## 🏗️ Architecture

OrderFlow is built with **Clean Architecture** principles, ensuring separation of concerns and maintainability.
```
┌─────────────────────────────────────────────┐
│                  React UI                    │
│            (Vite + Tailwind CSS)             │
└─────────────────┬───────────────────────────┘
                  │ HTTP
┌─────────────────▼───────────────────────────┐
│              OrderFlow.API                   │
│         ASP.NET Core + Swagger               │
└─────────────────┬───────────────────────────┘
                  │ MediatR (CQRS)
┌─────────────────▼───────────────────────────┐
│           OrderFlow.Application              │
│     Commands │ Queries │ Validators          │
└─────────────────┬───────────────────────────┘
                  │
┌────────────┬────▼────────────┐
│            │                 │
▼            ▼                 ▼
Domain   Infrastructure   NotificationWorker
Entities  EF Core           RabbitMQ Consumer
Rules     PostgreSQL        MassTransit
Events    RabbitMQ
```

### Layer Responsibilities

| Layer | Responsibility | Dependencies |
|-------|---------------|--------------|
| **Domain** | Business rules, entities, events | None |
| **Application** | CQRS handlers, validation, interfaces | Domain only |
| **Infrastructure** | DB, messaging, repositories | Application + Domain |
| **API** | HTTP endpoints, middleware | Application + Infrastructure |
| **NotificationWorker** | Event consumers | Application |

---

## ✨ Features

- ✅ **Clean Architecture** with strict layer separation
- ✅ **CQRS Pattern** via MediatR — separate read/write models
- ✅ **Event-Driven Messaging** — RabbitMQ + MassTransit
- ✅ **Rich Domain Model** — business rules enforced in entities
- ✅ **FluentValidation** — request validation pipeline
- ✅ **Global Exception Middleware** — consistent error responses
- ✅ **EF Core + PostgreSQL** — code-first with migrations
- ✅ **Swagger UI** — interactive API documentation
- ✅ **React Dashboard** — real-time order management UI
- ✅ **Docker** — containerized PostgreSQL + RabbitMQ

---

## 🚀 Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js 18+](https://nodejs.org/)

### 1. Clone the repository
```bash
git clone https://github.com/sema27/OrderFlow.git
cd OrderFlow
```

### 2. Start infrastructure with Docker
```bash
# PostgreSQL
docker run --name orderflow-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=orderflow \
  -p 5432:5432 -d postgres:17

# RabbitMQ
docker run --name orderflow-rabbitmq \
  -p 5672:5672 -p 15672:15672 \
  -d rabbitmq:3-management
```

### 3. Apply database migrations
```bash
cd OrderFlow.API
dotnet ef database update
```

### 4. Run the backend
```bash
# Terminal 1 — API
cd OrderFlow.API
dotnet run

# Terminal 2 — Notification Worker
cd OrderFlow.NotificationWorker
dotnet run
```

### 5. Run the frontend
```bash
cd orderflow-ui
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) 🎉

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/orders` | List all orders |
| `GET` | `/api/orders/{id}` | Get order by ID |
| `POST` | `/api/orders` | Create new order |
| `PATCH` | `/api/orders/{id}/confirm` | Confirm order |
| `PATCH` | `/api/orders/{id}/cancel` | Cancel order |

### Example Request
```json
POST /api/orders
{
  "customerEmail": "customer@example.com",
  "items": [
    {
      "productName": "Laptop",
      "unitPrice": 15000,
      "quantity": 1
    }
  ]
}
```

### Example Response
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "customerEmail": "customer@example.com",
  "status": "Pending",
  "totalAmount": 15000,
  "createdAt": "2026-03-05T10:00:00Z",
  "items": [
    {
      "productName": "Laptop",
      "unitPrice": 15000,
      "quantity": 1
    }
  ]
}
```

---

## 🔄 Order State Machine
```
Pending ──► Confirmed ──► Shipped
   │              │
   └──────────────┴──► Cancelled
```

Business rules are enforced in the Domain layer:
- Only `Pending` orders can be confirmed
- `Shipped` orders cannot be cancelled
- State transitions are atomic and validated

---

## 🐇 Event-Driven Flow
```
POST /api/orders
      │
      ▼
CreateOrderCommandHandler
      │
      ├──► PostgreSQL (save order)
      │
      └──► RabbitMQ (publish OrderPlacedEvent)
                │
                ▼
        NotificationWorker
        (OrderPlacedConsumer)
                │
                ▼
        Log / Send Email
```

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Backend Framework | ASP.NET Core 8 |
| Architecture | Clean Architecture + CQRS |
| Messaging | RabbitMQ + MassTransit |
| ORM | Entity Framework Core 8 |
| Database | PostgreSQL 17 |
| Validation | FluentValidation |
| API Docs | Swagger / OpenAPI |
| Frontend | React + Vite + Tailwind CSS |
| Containerization | Docker |
