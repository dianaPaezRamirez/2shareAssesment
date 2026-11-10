# 2. Architecture and Logical Design

This document shows how the solution is organized: the system as a whole, the internal structure of
each part, and the logical data model.

## 2.1 System architecture

The solution has three independent parts. They only communicate through a REST/JSON API, so a new
client (for example, a mobile app) can use the same backend.

```mermaid
flowchart LR
    user(["👤 User"])

    subgraph client["Browser"]
        spa["Web client<br/><i>React + TypeScript (Vite)</i>"]
    end

    subgraph server["Server"]
        api["REST API<br/><i>ASP.NET Core .NET 10</i>"]
    end

    db[("Database<br/><i>SQL Server / LocalDB</i>")]

    user -- "Uses" --> spa
    spa -- "HTTPS · JSON<br/>Authorization: Bearer JWT" --> api
    api -- "EF Core · SQL" --> db
```

| Part | Responsibility |
|---|---|
| Web client | User interface only. Validates the forms, keeps the session token and calls the API. It holds no business data. |
| REST API | Business rules, authentication (JWT) and data access. It is stateless: every request carries its token. |
| Database | Stores users and grocery items. |

## 2.2 Software architecture

Both the backend and the frontend use a **hexagonal architecture (ports and adapters)**. The business
core is in the center and does not depend on frameworks, the database or HTTP. The outer layers depend
on the inner ones, never the other way around.

### Backend

```mermaid
flowchart TB
    subgraph api["GroceryList.Api — input adapter"]
        controllers["Controllers"]
        handler["GlobalExceptionHandler"]
    end

    subgraph app["GroceryList.Application — use cases"]
        services["AuthService · GroceryItemService"]
        dtos["DTOs (requests / responses)"]
        ports["Ports<br/>IUserRepository · IGroceryItemRepository · IUnitOfWork<br/>IPasswordHasher · ITokenService"]
    end

    subgraph domain["GroceryList.Domain — business core"]
        entities["Entities: User · GroceryItem<br/>DomainException"]
    end

    subgraph infra["GroceryList.Infrastructure — output adapters"]
        efcore["EF Core DbContext + Repositories"]
        security["BCryptPasswordHasher · JwtTokenService"]
    end

    controllers --> services
    services --> entities
    services --> ports
    efcore -. "implements" .-> ports
    security -. "implements" .-> ports
    efcore --> db[("SQL Server")]
```

| Project | Contains | Depends on |
|---|---|---|
| `Domain` | Entities and their rules | Nothing |
| `Application` | Use cases, DTOs, ports (interfaces), application exceptions | Domain |
| `Infrastructure` | EF Core, repositories, migrations, BCrypt, JWT | Application, Domain |
| `Api` | Controllers, authentication, error handling, Swagger, composition root (`Program.cs`) | Application, Infrastructure |

### Frontend

```mermaid
flowchart TB
    subgraph ui["ui — input adapter"]
        pages["Pages · Components · Routes"]
        hooks["Hooks: useAuth · useGroceryList"]
    end

    subgraph application["application — use cases"]
        usecases["authUseCases · groceryListUseCases"]
        fports["Ports: AuthRepository · GroceryItemRepository"]
    end

    subgraph fdomain["domain — core"]
        types["Types + Zod schemas<br/>User · Session · GroceryItem"]
    end

    subgraph finfra["infrastructure — output adapters"]
        http["axios httpClient + HTTP repositories"]
    end

    store["store — Zustand session"]
    root["dependencies.ts — composition root"]

    pages --> hooks --> usecases
    usecases --> fports
    usecases --> types
    http -. "implements" .-> fports
    hooks --> store
    root -. "wires" .-> http
    http -- "REST / JSON" --> backend["REST API"]
```

## 2.3 Logical data model

```mermaid
erDiagram
    USER ||--o{ GROCERY_ITEM : owns

    USER {
        guid Id PK
        string Username UK "3-50 chars, case-insensitive"
        string FullName "max 100"
        string PasswordHash "BCrypt"
        datetime CreatedAt "UTC"
    }

    GROCERY_ITEM {
        guid Id PK
        guid UserId FK
        string Name "max 100, duplicates allowed"
        bool IsTagged "in basket"
        datetime CreatedAt "UTC"
        datetime DeletedAt "null = active (soft delete)"
    }
```

- A user has **one list**: the list is the set of the user's grocery items, so no `List` table is needed.
- A removed item keeps its row with `DeletedAt` set; every query ignores it.

## 2.4 Main flow: add a product

```mermaid
sequenceDiagram
    actor U as User
    participant W as Web client
    participant A as API (Controller)
    participant S as GroceryItemService
    participant D as GroceryItem (Domain)
    participant DB as SQL Server

    U->>W: Types "Milk" and presses Add
    W->>W: Validates the form (Zod)
    W->>A: POST /api/grocery-items + Bearer token
    A->>A: Validates the token and the request
    A->>S: AddAsync(userId from token, request)
    S->>D: GroceryItem.Create(userId, "Milk")
    D-->>S: New item (rules applied)
    S->>DB: INSERT (SaveChanges)
    S-->>A: GroceryItemDto
    A-->>W: 201 Created + JSON
    W-->>U: Shows "Milk" in "To buy"
```

## 2.5 Architecture decisions

| Decision | Reason |
|---|---|
| Hexagonal architecture on both sides | Business rules are isolated and easy to test; the database or the UI can change without touching them. |
| Stateless REST API with JWT | Any client can use it; no server session to manage. |
| User identified only from the token | A user can never send another user's id, so they cannot read or change other lists. |
| Soft delete | Requested by the reviewer; keeps history for a future recycle bin. |
| EF Core code-first migrations | The schema is versioned with the code and applied automatically in development. |
