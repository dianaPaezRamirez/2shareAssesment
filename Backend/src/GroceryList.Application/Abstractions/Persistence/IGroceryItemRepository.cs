using GroceryList.Domain.Entities;

namespace GroceryList.Application.Abstractions.Persistence;

public interface IGroceryItemRepository
{
    Task<IReadOnlyList<GroceryItem>> GetByUserAsync(Guid userId, CancellationToken cancellationToken);

    /// <summary>
    /// Returns the item only if it belongs to the given user; otherwise <c>null</c>.
    /// </summary>
    Task<GroceryItem?> GetByIdAsync(Guid itemId, Guid userId, CancellationToken cancellationToken);

    void Add(GroceryItem item);
}
