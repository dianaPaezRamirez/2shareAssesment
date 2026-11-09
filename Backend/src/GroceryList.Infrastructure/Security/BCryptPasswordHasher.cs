using GroceryList.Application.Abstractions.Security;

namespace GroceryList.Infrastructure.Security;

internal sealed class BCryptPasswordHasher : IPasswordHasher
{
    // Each increment doubles the hashing time; 12 is a common balance between security and login speed.
    private const int WorkFactor = 12;

    public string Hash(string password) => BCrypt.Net.BCrypt.HashPassword(password, WorkFactor);

    public bool Verify(string password, string passwordHash) => BCrypt.Net.BCrypt.Verify(password, passwordHash);
}
