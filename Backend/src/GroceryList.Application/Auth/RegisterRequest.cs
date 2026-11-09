using System.ComponentModel.DataAnnotations;
using GroceryList.Domain.Entities;

namespace GroceryList.Application.Auth;

public sealed record RegisterRequest
{
    [Required]
    [StringLength(User.UsernameMaxLength, MinimumLength = 3)]
    [RegularExpression("^[a-zA-Z0-9._-]+$",
        ErrorMessage = "Username can only contain letters, numbers, dots, underscores and hyphens.")]
    public string Username { get; init; } = string.Empty;

    [Required]
    [StringLength(User.FullNameMaxLength)]
    public string FullName { get; init; } = string.Empty;

    [Required]
    [StringLength(100, MinimumLength = 8)]
    public string Password { get; init; } = string.Empty;
}
