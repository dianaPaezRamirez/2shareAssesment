using GroceryList.Application.Abstractions.Persistence;
using GroceryList.Application.Abstractions.Security;
using GroceryList.Infrastructure.Persistence;
using GroceryList.Infrastructure.Persistence.Repositories;
using GroceryList.Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace GroceryList.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        AddPersistence(services, configuration);
        AddSecurity(services, configuration);

        return services;
    }

    private static void AddPersistence(IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("GroceryListDb")
            ?? throw new InvalidOperationException("Connection string 'GroceryListDb' is not configured.");

        services.AddDbContext<GroceryListDbContext>(options => options.UseSqlServer(connectionString));

        services.AddScoped<IUnitOfWork>(provider => provider.GetRequiredService<GroceryListDbContext>());
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IGroceryItemRepository, GroceryItemRepository>();
    }

    private static void AddSecurity(IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<JwtOptions>()
            .Bind(configuration.GetSection(JwtOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddSingleton<IPasswordHasher, BCryptPasswordHasher>();
        services.AddSingleton<ITokenService, JwtTokenService>();
    }
}
