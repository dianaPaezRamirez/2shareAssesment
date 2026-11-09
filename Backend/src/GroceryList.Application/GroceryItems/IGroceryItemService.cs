namespace GroceryList.Application.GroceryItems;

/// <summary>
/// Grocery list use cases. Every operation is scoped to the given user,
/// so a user can never read or modify items that belong to someone else.
/// </summary>
public interface IGroceryItemService
{
    Task<IReadOnlyList<GroceryItemDto>> GetAllAsync(Guid userId, CancellationToken cancellationToken);

    Task<GroceryItemDto> AddAsync(Guid userId, CreateGroceryItemRequest request, CancellationToken cancellationToken);

    Task RemoveAsync(Guid userId, Guid itemId, CancellationToken cancellationToken);

    Task<GroceryItemDto> TagAsync(Guid userId, Guid itemId, CancellationToken cancellationToken);

    Task<GroceryItemDto> UntagAsync(Guid userId, Guid itemId, CancellationToken cancellationToken);
}
