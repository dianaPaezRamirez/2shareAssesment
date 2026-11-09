using System.ComponentModel.DataAnnotations;

namespace GroceryList.Infrastructure.Security;

public sealed class JwtOptions
{
    public const string SectionName = "Jwt";

    [Required]
    public string Issuer { get; init; } = string.Empty;

    [Required]
    public string Audience { get; init; } = string.Empty;

    // HMAC-SHA256 requires a key of at least 256 bits (32 bytes).
    [Required]
    [MinLength(32)]
    public string SecretKey { get; init; } = string.Empty;

    [Range(1, 1440)]
    public int ExpirationMinutes { get; init; } = 60;
}
