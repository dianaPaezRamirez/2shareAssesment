using GroceryList.Application.Abstractions.Persistence;
using GroceryList.Application.Exceptions;
using GroceryList.Domain.Entities;

namespace GroceryList.Application.GroceryItems;

internal sealed class GroceryItemService(
    IGroceryItemRepository groceryItemRepository,
    IUnitOfWork unitOfWork) : IGroceryItemService
{
    public async Task<IReadOnlyList<GroceryItemDto>> GetAllAsync(Guid userId, CancellationToken cancellationToken)
    {
        var items = await groceryItemRepository.GetByUserAsync(userId, cancellationToken);
        return [.. items.Select(GroceryItemDto.FromEntity)];
    }

    public async Task<GroceryItemDto> AddAsync(Guid userId, CreateGroceryItemRequest request, CancellationToken cancellationToken)
    {
        var item = GroceryItem.Create(userId, request.Name);

        groceryItemRepository.Add(item);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return GroceryItemDto.FromEntity(item);
    }

    public async Task RemoveAsync(Guid userId, Guid itemId, CancellationToken cancellationToken)
    {
        var item = await GetOwnedItemAsync(userId, itemId, cancellationToken);

        groceryItemRepository.Remove(item);
        await unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task<GroceryItemDto> TagAsync(Guid userId, Guid itemId, CancellationToken cancellationToken)
    {
        var item = await GetOwnedItemAsync(userId, itemId, cancellationToken);

        item.Tag();
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return GroceryItemDto.FromEntity(item);
    }

    public async Task<GroceryItemDto> UntagAsync(Guid userId, Guid itemId, CancellationToken cancellationToken)
    {
        var item = await GetOwnedItemAsync(userId, itemId, cancellationToken);

        item.Untag();
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return GroceryItemDto.FromEntity(item);
    }

    // Items of other users are reported as "not found" instead of "forbidden",
    // so the API does not confirm that the item exists.
    private async Task<GroceryItem> GetOwnedItemAsync(Guid userId, Guid itemId, CancellationToken cancellationToken) =>
        await groceryItemRepository.GetByIdAsync(itemId, userId, cancellationToken)
            ?? throw new NotFoundException($"Grocery item '{itemId}' was not found.");
}
