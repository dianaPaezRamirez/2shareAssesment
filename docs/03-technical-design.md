# 3. Technical Design

This document describes the technical details of the implementation. The API endpoints and the
setup steps are in the [README](../README.md).

## 3.1 Technology stack

| Area | Technology |
|---|---|
| Backend | .NET 10, ASP.NET Core (controllers), EF Core 10 (SQL Server), BCrypt.Net-Next, JWT Bearer, Swagger UI |
| Database | SQL Server LocalDB (any SQL Server instance works) |
| Frontend | React 19, TypeScript 7, Vite 8, react-router 7, Zustand 5, axios, Zod 4, react-hook-form, SCSS modules |
| Quality | Nullable reference types enabled (backend), TypeScript strict mode and oxlint (frontend) |

## 3.2 Backend

### Request pipeline

`Exception handler → CORS → Authentication (JWT) → Authorization → Controller`

- Controllers are thin: they read the user id from the token (`User.GetUserId()`), call one service
  method and return the result.
- `[ApiController]` validates the request DTOs (`[Required]`, `[StringLength]`) and returns `400`
  automatically.
- There is no `try/catch` in controllers or services. Each layer throws a specific exception and
  `GlobalExceptionHandler` converts it into a Problem Details response:

| Exception | Status |
|---|---|
| `DomainException` | `400` |
| `InvalidCredentialsException` | `401` |
| `NotFoundException` | `404` |
| `ConflictException` | `409` |
| Any other | `500` (generic message; the detail is only written to the log) |

### Validation in two levels

1. **Input validation** in the DTOs (format and length), to reject bad requests early.
2. **Business rules** in the entities (`User.Create`, `GroceryItem.Create`). Properties have
   `private set`, so an entity cannot be left in an invalid state.

### Persistence

- EF Core code-first with Fluent API configurations (`Persistence/Configurations`).
- Migrations are in `Infrastructure/Persistence/Migrations`; in development they are applied on startup.
  `DB/GroceryListDb_schema.sql` contains the equivalent SQL script.
- `IUnitOfWork.SaveChangesAsync` saves all the changes of a use case in one transaction.
- **Soft delete:** `GroceryItem.MarkAsDeleted()` sets `DeletedAt`, and a global query filter
  (`DeletedAt == null`) hides removed items from every query.
- Unique index on `Users.Username`; foreign key `GroceryItems.UserId → Users.Id`.

### Security

| Topic | Implementation |
|---|---|
| Passwords | Hashed with BCrypt (work factor 12). The plain password is never stored or logged. |
| Token | JWT signed with HMAC-SHA256. Claims: `sub` (user id), `unique_name`, `name`. Valid for 60 minutes. |
| Token validation | Issuer, audience, signing key and lifetime are validated (30 seconds of clock skew). |
| Data isolation | Every item query filters by the user id from the token. Another user's item returns `404`, not `403`, so its existence is not revealed. |
| Login errors | Wrong username and wrong password return the same message. |
| Configuration | `Jwt:SecretKey` (minimum 32 characters) is validated on startup; the API does not start without it. CORS only allows the configured frontend origin. |

## 3.3 Frontend

### Folder structure

| Folder | Content |
|---|---|
| `domain/` | Types and Zod schemas (`User`, `Session`, `GroceryItem`, form rules) |
| `application/` | Ports (repository interfaces), use cases and `ApplicationError` |
| `infrastructure/` | `env.ts` (validated configuration), axios `httpClient`, HTTP repositories |
| `store/` | Zustand session store |
| `ui/` | Hooks, components, pages and routes |
| `dependencies.ts` | Composition root: creates the HTTP client and the use cases |

### HTTP client (axios)

- A **request interceptor** adds `Authorization: Bearer <token>`.
- A **response interceptor** converts every error into an `ApplicationError` with a kind
  (`validation`, `unauthorized`, `notFound`, `conflict`, `network`, `unexpected`). Field errors from
  the API are mapped to the form fields.
- A `401` with an active session clears the session, and the routes send the user to the login page.
- Every response is validated with a Zod schema, so unexpected data never reaches the UI.

### Session

- Stored with Zustand `persist` in **sessionStorage**: it survives a reload and is removed when the tab
  is closed.
- The expiration date returned by the API is checked on load and before showing protected pages.
- `ProtectedRoute` and `PublicOnlyRoute` control navigation depending on the session.

### Forms and state

- react-hook-form with `zodResolver`, using the same schemas as the domain layer.
- `useGroceryList` keeps the items, loading and error state. Buttons of an item are disabled while
  its request is running.

### Configuration

`VITE_API_URL` is defined in `.env.development` (local) or `.env.production` (build, see
`.env.example`). It is validated on startup with Zod.
