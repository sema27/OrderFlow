# 📦 OrderFlow

> Full-stack e-commerce order management system built with **.NET 8**, **Clean Architecture**, **RabbitMQ**, **PostgreSQL**, and **React**.

![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=flat-square&logo=dotnet)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-MassTransit-FF6600?style=flat-square&logo=rabbitmq)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?style=flat-square&logo=postgresql)
![React](https://img.shields.io/badge/React-Vite-61DAFB?style=flat-square&logo=react)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker)
![CI](https://github.com/sema27/OrderFlow/actions/workflows/ci.yml/badge.svg)

---

## 🏗️ Architecture

OrderFlow is built with **Clean Architecture** principles, ensuring separation of concerns and maintainability.
```
┌─────────────────────────────────────────────┐
│              React + Vite UI                 │
│         (Tailwind CSS + React Router)        │
└─────────────────┬───────────────────────────┘
                  │ HTTP / JWT
┌─────────────────▼───────────────────────────┐
│              OrderFlow.API                   │
│       ASP.NET Core 8 + Swagger UI            │
└─────────────────┬───────────────────────────┘
                  │ MediatR (CQRS)
┌─────────────────▼───────────────────────────┐
│           OrderFlow.Application              │
│   Commands │ Queries │ Validators │ DTOs     │
└─────────────────┬───────────────────────────┘
                  │
┌────────────┬────▼──────────────┐
│            │                   │
▼            ▼                   ▼
Domain   Infrastructure   NotificationWorker
Entities  EF Core           RabbitMQ Consumer
Rules     PostgreSQL        MassTransit
Events    RabbitMQ
JWT Auth  Repositories
```

### Layer Responsibilities

| Layer | Responsibility | Dependencies |
|-------|---------------|--------------|
| **Domain** | Business rules, entities, events | None |
| **Application** | CQRS handlers, validation, interfaces | Domain only |
| **Infrastructure** | DB, messaging, auth, repositories | Application + Domain |
| **API** | HTTP endpoints, middleware, JWT | Application + Infrastructure |
| **NotificationWorker** | Event consumers | Application |

---

## ✨ Features

### 👤 User Features
- ✅ Register & Login with JWT authentication
- ✅ Profile management (update name)
- ✅ Product listing with search & category filter
- ✅ Cart management (add, remove, update quantity)
- ✅ Favorites (toggle, list)
- ✅ Checkout from cart
- ✅ Order history with status tracking

### 🔐 Admin Features
- ✅ Order management (confirm, ship, cancel)
- ✅ Product management (add, update)
- ✅ Category management
- ✅ User listing

### 🏛️ Technical Features
- ✅ **Clean Architecture** with strict layer separation
- ✅ **CQRS Pattern** via MediatR
- ✅ **Rich Domain Model** — business rules in entities
- ✅ **Event-Driven Messaging** — RabbitMQ + MassTransit
- ✅ **JWT Authentication** with role-based authorization
- ✅ **FluentValidation** pipeline
- ✅ **Global Exception Middleware**
- ✅ **EF Core + PostgreSQL** code-first migrations
- ✅ **Docker** containerized infrastructure
- ✅ **GitHub Actions** CI/CD pipeline

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
docker run --name orderflow-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=orderflow \
  -p 5432:5432 -d postgres:17

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
cd OrderFlow.API && dotnet run

# Terminal 2 — Notification Worker
cd OrderFlow.NotificationWorker && dotnet run
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

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | List products (search, filter, paginate) |
| `POST` | `/api/products` | Create product (Admin) |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/cart` | Get cart |
| `POST` | `/api/cart/add` | Add item to cart |
| `PATCH` | `/api/cart/update` | Update item quantity |
| `DELETE` | `/api/cart/remove/{productId}` | Remove item |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/orders/my` | Get my orders |
| `POST` | `/api/orders/checkout` | Checkout from cart |
| `GET` | `/api/orders/all` | Get all orders (Admin) |
| `PATCH` | `/api/orders/{id}/confirm` | Confirm order (Admin) |
| `PATCH` | `/api/orders/{id}/ship` | Ship order (Admin) |
| `PATCH` | `/api/orders/{id}/cancel` | Cancel order (Admin) |

### Favorites
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/favorites` | Get favorites |
| `POST` | `/api/favorites/toggle/{productId}` | Toggle favorite |

---

## 🔄 Order State Machine
```
Pending ──► Confirmed ──► Shipped
   │              │
   └──────────────┴──► Cancelled
```

Business rules enforced in Domain layer:
- Only `Pending` orders can be confirmed
- Only `Confirmed` orders can be shipped
- `Shipped` orders cannot be cancelled

---

## 🐇 Event-Driven Flow
```
POST /api/orders/checkout
         │
         ▼
  CheckoutHandler
         │
         ├──► PostgreSQL (save order)
         │
         └──► RabbitMQ (OrderPlacedEvent)
                    │
                    ▼
          NotificationWorker
          (OrderPlacedConsumer)
                    │
                    ▼
              Log / Email
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
| Authentication | JWT Bearer |
| Validation | FluentValidation |
| API Docs | Swagger / OpenAPI |
| Frontend | React + Vite + Tailwind CSS |
| Containerization | Docker |
| CI/CD | GitHub Actions |
