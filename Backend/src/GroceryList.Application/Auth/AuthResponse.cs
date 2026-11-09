using GroceryList.Domain.Entities;

namespace GroceryList.Application.Auth;

public sealed record AuthResponse(string Token, DateTime ExpiresAt, UserDto User);

public sealed record UserDto(Guid Id, string Username, string FullName)
{
    public static UserDto FromEntity(User user) => new(user.Id, user.Username, user.FullName);
}
