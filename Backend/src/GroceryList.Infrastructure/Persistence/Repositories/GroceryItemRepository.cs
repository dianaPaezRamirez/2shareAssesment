using GroceryList.Application.Abstractions.Persistence;
using GroceryList.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GroceryList.Infrastructure.Persistence.Repositories;

internal sealed class GroceryItemRepository(GroceryListDbContext dbContext) : IGroceryItemRepository
{
    public async Task<IReadOnlyList<GroceryItem>> GetByUserAsync(Guid userId, CancellationToken cancellationToken) =>
        await dbContext.GroceryItems
            .AsNoTracking()
            .Where(i => i.UserId == userId)
            .OrderBy(i => i.CreatedAt)
            .ToListAsync(cancellationToken);

    public Task<GroceryItem?> GetByIdAsync(Guid itemId, Guid userId, CancellationToken cancellationToken) =>
        dbContext.GroceryItems.FirstOrDefaultAsync(i => i.Id == itemId && i.UserId == userId, cancellationToken);

    public void Add(GroceryItem item) => dbContext.GroceryItems.Add(item);
}
