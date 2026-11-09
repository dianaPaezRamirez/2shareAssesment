using GroceryList.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace GroceryList.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("GroceryListDb")
            ?? throw new InvalidOperationException("Connection string 'GroceryListDb' is not configured.");

        services.AddDbContext<GroceryListDbContext>(options => options.UseSqlServer(connectionString));

        return services;
    }
}
