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

_Work in progress. Step-by-step instructions will be added as each part is completed._
