using GroceryList.Domain.Exceptions;

namespace GroceryList.Domain.Entities;

public class GroceryItem
{
    public const int NameMaxLength = 100;

    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public string Name { get; private set; } = null!;

    /// <summary>
    /// True when the item has been placed in the basket while shopping.
    /// </summary>
    public bool IsTagged { get; private set; }

    public DateTime CreatedAt { get; private set; }

    // Required by EF Core to materialize entities from the database.
    private GroceryItem() { }

    public static GroceryItem Create(Guid userId, string name)
    {
        name = name?.Trim() ?? string.Empty;

        if (userId == Guid.Empty)
            throw new DomainException("A grocery item must belong to a user.");

        if (name.Length == 0 || name.Length > NameMaxLength)
            throw new DomainException($"Item name is required and cannot exceed {NameMaxLength} characters.");

        return new GroceryItem
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = name,
            IsTagged = false,
            CreatedAt = DateTime.UtcNow
        };
    }

    public void Tag() => IsTagged = true;

    public void Untag() => IsTagged = false;
}
