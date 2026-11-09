using GroceryList.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GroceryList.Infrastructure.Persistence;

public class GroceryListDbContext(DbContextOptions<GroceryListDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<GroceryItem> GroceryItems => Set<GroceryItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(GroceryListDbContext).Assembly);
    }
}
