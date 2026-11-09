using GroceryList.Domain.Entities;

namespace GroceryList.Application.GroceryItems;

public sealed record GroceryItemDto(Guid Id, string Name, bool IsTagged, DateTime CreatedAt)
{
    public static GroceryItemDto FromEntity(GroceryItem item) =>
        new(item.Id, item.Name, item.IsTagged, item.CreatedAt);
}
