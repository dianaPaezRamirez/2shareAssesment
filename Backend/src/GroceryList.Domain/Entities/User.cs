using GroceryList.Domain.Exceptions;

namespace GroceryList.Domain.Entities;

public class User
{
    public const int UsernameMaxLength = 50;
    public const int FullNameMaxLength = 100;

    public Guid Id { get; private set; }
    public string Username { get; private set; } = null!;
    public string FullName { get; private set; } = null!;
    public string PasswordHash { get; private set; } = null!;
    public DateTime CreatedAt { get; private set; }

    // Required by EF Core to materialize entities from the database.
    private User() { }

    public static User Create(string username, string fullName, string passwordHash)
    {
        username = username?.Trim() ?? string.Empty;
        fullName = fullName?.Trim() ?? string.Empty;

        if (username.Length == 0 || username.Length > UsernameMaxLength)
            throw new DomainException($"Username is required and cannot exceed {UsernameMaxLength} characters.");

        if (fullName.Length == 0 || fullName.Length > FullNameMaxLength)
            throw new DomainException($"Full name is required and cannot exceed {FullNameMaxLength} characters.");

        if (string.IsNullOrWhiteSpace(passwordHash))
            throw new DomainException("Password hash is required.");

        return new User
        {
            Id = Guid.NewGuid(),
            Username = username,
            FullName = fullName,
            PasswordHash = passwordHash,
            CreatedAt = DateTime.UtcNow
        };
    }
}
