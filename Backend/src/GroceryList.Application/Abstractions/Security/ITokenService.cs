using GroceryList.Domain.Entities;

namespace GroceryList.Application.Abstractions.Security;

public interface ITokenService
{
    AccessToken CreateToken(User user);
}

public sealed record AccessToken(string Token, DateTime ExpiresAt);
