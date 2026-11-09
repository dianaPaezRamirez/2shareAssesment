using GroceryList.Application.Auth;
using GroceryList.Application.GroceryItems;
using Microsoft.Extensions.DependencyInjection;

namespace GroceryList.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IGroceryItemService, GroceryItemService>();

        return services;
    }
}
