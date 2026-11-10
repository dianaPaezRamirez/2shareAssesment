# 4. Handover

This document is for the next developer who works on the project.

## 4.1 Current status

- All nine user stories of the assessment are implemented (see the [functional design](01-functional-design.md)).
- The backend builds without warnings and the frontend builds and passes the linter.
- The answers to the clarification questions are applied (soft delete, single tag status, duplicates allowed).

## 4.2 How to run it

Follow the [README](../README.md#getting-started). In short:

1. Backend: run `GroceryList.Api` (Visual Studio or `dotnet run`). The database is created automatically
   in development. Swagger is available at `/swagger`.
2. Frontend: `npm install` and `npm run dev` in `Frontend/`, then open `http://localhost:5173`.

## 4.3 Configuration

| Setting | Where | Notes |
|---|---|---|
| `ConnectionStrings:GroceryListDb` | `appsettings.json` | LocalDB by default. |
| `Jwt:SecretKey` | `appsettings.Development.json` | Development only. In other environments use the variable `Jwt__SecretKey` (at least 32 characters). |
| `Jwt:ExpirationMinutes` | `appsettings.json` | 60 by default. |
| `Cors:AllowedOrigins` | `appsettings.json` | Must contain the frontend URL. |
| `VITE_API_URL` | `Frontend/.env.development` | API URL used by the frontend. |

## 4.4 Where to start in the code

| To change… | Start in |
|---|---|
| A business rule | `Backend/src/GroceryList.Domain/Entities` |
| A use case | `Backend/src/GroceryList.Application/<Feature>/…Service.cs` |
| An endpoint | `Backend/src/GroceryList.Api/Controllers` |
| The database schema | Entity + `Infrastructure/Persistence/Configurations`, then a new migration (see README) |
| A screen | `Frontend/src/ui/pages` and `Frontend/src/ui/components` |
| An API call from the frontend | `Frontend/src/infrastructure/*/http…Repository.ts` |

To add an endpoint, work from the inside out: domain rule → DTO → service and its interface →
repository (only if a new query is needed) → controller.

## 4.5 Known limitations

- Logout only discards the token on the client; a token stays valid until it expires (60 minutes).
- There is no refresh token: the user logs in again after the session expires.
- There are no automated tests yet; the API was tested manually with Swagger and the `.http` file.
- No password recovery or profile management.
- Not deployed online; it runs locally.

## 4.6 Suggested next steps

1. **Quantities per product** (suggested by the reviewer): new column, migration, DTO field and UI input.
2. **Recycle bin**: list removed items with `IgnoreQueryFilters()` and an endpoint to restore them.
3. **Automated tests**: unit tests for the entities and services, integration tests for the API.
4. **Rename a product**: `PATCH /api/grocery-items/{id}`.
5. **Deployment**: for example Azure App Service + Azure SQL for the API and a static hosting for the frontend,
   with the secret key in environment variables.
