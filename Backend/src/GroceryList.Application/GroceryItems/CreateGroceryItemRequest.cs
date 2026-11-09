using System.ComponentModel.DataAnnotations;
using GroceryList.Domain.Entities;

namespace GroceryList.Application.GroceryItems;

public sealed record CreateGroceryItemRequest
{
    [Required]
    [StringLength(GroceryItem.NameMaxLength)]
    public string Name { get; init; } = string.Empty;
}
