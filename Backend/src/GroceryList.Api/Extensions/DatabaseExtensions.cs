using GroceryList.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace GroceryList.Api.Extensions;

public static class DatabaseExtensions
{
    /// <summary>
    /// Creates the database and applies pending migrations on startup,
    /// so the project can run right after cloning without manual SQL steps.
    /// </summary>
    public static async Task ApplyMigrationsAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<GroceryListDbContext>();
        await dbContext.Database.MigrateAsync();
    }
}
