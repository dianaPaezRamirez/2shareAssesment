# Grocery List

Demo web application where users register, log in and manage their own grocery list:
add products, remove them, and tag them as "in basket" while shopping.

The solution is split into independent parts that communicate only through a REST/JSON API,
so the frontend or the backend can be replaced without changing the other.

## Repository structure

| Folder | Content |
|---|---|
| `Backend/` | REST API built with C# / .NET 10 (hexagonal architecture) |
| `Frontend/` | Web client built with React + TypeScript (hexagonal architecture) |
| `DB/` | SQL scripts that document the database schema (SQL Server) |
| `docs/` | Functional, logical and technical documentation, including diagrams |

## Requirements

- [.NET SDK 10](https://dotnet.microsoft.com/download/dotnet/10.0)
- [Node.js 20+](https://nodejs.org/)
- SQL Server LocalDB (installed with Visual Studio) or any SQL Server instance

## Getting started

### Backend

```
cd Backend
dotnet run --project src/GroceryList.Api
```

The API starts at `http://localhost:5248`. On the first run it creates the database automatically
(see [Database](#database)).

There are two ways to try the endpoints while running in `Development`:

- **Swagger UI** at `http://localhost:5248/swagger` (opened automatically when the API is started
  from Visual Studio). Call register or login, click **Authorize** and paste the returned token
  to call the protected endpoints.
- **`Backend/src/GroceryList.Api/GroceryList.Api.http`** in Visual Studio, Rider or VS Code
  (REST Client extension). Run the requests in order; the token is reused automatically.

The raw OpenAPI document is available at `http://localhost:5248/openapi/v1.json`.

### Frontend

With the API running, in another terminal:

```
cd Frontend
npm install
npm run dev
```

The application starts at `http://localhost:5173`. The port is fixed because it is the origin
allowed by the API (`Cors:AllowedOrigins`).

The API URL is read from `VITE_API_URL`, defined in `Frontend/.env.development` for local
development. To use a different URL on your machine, create `Frontend/.env.development.local`
(ignored by Git). For a production build, see `Frontend/.env.example`.

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and build for production into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run the linter (oxlint) |

## API

All endpoints use JSON. Grocery item endpoints require the header `Authorization: Bearer <token>`,
using the token returned by register or login. The user is always identified from the token,
so a user can only access their own items.

| Method | Endpoint | Description | Success |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register with username, full name and password. Returns a token. | `201` |
| `POST` | `/api/auth/login` | Log in with username and password. Returns a token. | `200` |
| `GET` | `/api/grocery-items` | Get the grocery list of the current user | `200` |
| `POST` | `/api/grocery-items` | Add a product | `201` |
| `DELETE` | `/api/grocery-items/{id}` | Remove a product (soft delete, see below) | `204` |
| `PATCH` | `/api/grocery-items/{id}/tag` | Tag a product (in the basket) | `200` |
| `PATCH` | `/api/grocery-items/{id}/untag` | Un-tag a product (back on the shelf) | `200` |

Errors follow the [Problem Details](https://www.rfc-editor.org/rfc/rfc9457) standard:

| Status | When |
|---|---|
| `400` | Invalid input (the response lists the invalid fields) |
| `401` | Missing, invalid or expired token, or wrong credentials |
| `404` | The product does not exist or belongs to another user |
| `409` | The username is already taken |

Removing a product is a **soft delete**: the row stays in the database with `DeletedAt` set, and
it is excluded from every query. This keeps the history needed for a future recycle bin or
restore feature.

Logging out is handled by the client by discarding the token. Tokens expire after 60 minutes
(`Jwt:ExpirationMinutes`).

## Configuration

| Setting | File | Notes |
|---|---|---|
| `ConnectionStrings:GroceryListDb` | `appsettings.json` | See [Database](#database) |
| `Jwt:Issuer`, `Jwt:Audience`, `Jwt:ExpirationMinutes` | `appsettings.json` | Token settings |
| `Jwt:SecretKey` | `appsettings.Development.json` | Development-only key. In any other environment it **must** be provided, for example with the environment variable `Jwt__SecretKey` (minimum 32 characters). The API does not start without it. |
| `Cors:AllowedOrigins` | `appsettings.json` | Frontend URLs allowed to call the API (`http://localhost:5173` by default) |

## Database

The backend uses **SQL Server LocalDB** by default. No manual setup is required:
when the API starts in the `Development` environment, it creates the `GroceryListDb`
database and applies any pending migrations automatically.

### Connection string

Defined in `Backend/src/GroceryList.Api/appsettings.json`:

```
Server=(localdb)\MSSQLLocalDB;Database=GroceryListDb;Trusted_Connection=True;TrustServerCertificate=True
```

To use a different SQL Server instance (for example SQL Server Express), change only this value.

### Inspecting the database

Connect with SQL Server Management Studio, Azure Data Studio or the Visual Studio
SQL Server Object Explorer using:

- **Server name:** `(localdb)\MSSQLLocalDB`
- **Authentication:** Windows Authentication
- **Trust server certificate:** enabled

The database contains the tables `Users`, `GroceryItems` and `__EFMigrationsHistory`
(used internally by Entity Framework Core to track which migrations have been applied).
Removed products remain in `GroceryItems` with a value in `DeletedAt`.

### Schema script

`DB/GroceryListDb_schema.sql` contains the full schema as an idempotent SQL script
(safe to run more than once). It is generated from the migrations and can be used
to create the database manually, without running the application.

### Working with migrations

The schema is managed with **Entity Framework Core migrations**, so every change to the
database is versioned in Git together with the code. Migrations live in
`Backend/src/GroceryList.Infrastructure/Persistence/Migrations`.

All commands are run from the `Backend` folder. The first time, restore the `dotnet-ef` tool:

```
dotnet tool restore
```

| Task | Command |
|---|---|
| List migrations and their status | `dotnet ef migrations list --project src/GroceryList.Infrastructure --startup-project src/GroceryList.Api` |
| Create a migration after changing an entity | `dotnet ef migrations add <MigrationName> --project src/GroceryList.Infrastructure --startup-project src/GroceryList.Api --output-dir Persistence/Migrations` |
| Apply pending migrations | `dotnet ef database update --project src/GroceryList.Infrastructure --startup-project src/GroceryList.Api` |
| Drop the database (it is recreated on the next run) | `dotnet ef database drop --project src/GroceryList.Infrastructure --startup-project src/GroceryList.Api` |
| Regenerate the schema script | `dotnet ef migrations script --idempotent --project src/GroceryList.Infrastructure --startup-project src/GroceryList.Api --output ../DB/GroceryListDb_schema.sql` |

`--project` points to where the migrations and the `DbContext` live (Infrastructure);
`--startup-project` points to where the configuration and connection string are read from (Api).

> Migrations are applied automatically only in `Development`. In other environments the
> schema script should be applied in a controlled way (for example, by a deployment pipeline).
