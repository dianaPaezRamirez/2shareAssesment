using GroceryList.Application.Abstractions.Persistence;
using GroceryList.Application.Abstractions.Security;
using GroceryList.Application.Exceptions;
using GroceryList.Domain.Entities;

namespace GroceryList.Application.Auth;

internal sealed class AuthService(
    IUserRepository userRepository,
    IUnitOfWork unitOfWork,
    IPasswordHasher passwordHasher,
    ITokenService tokenService) : IAuthService
{
    public async Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken)
    {
        var username = request.Username.Trim();

        if (await userRepository.UsernameExistsAsync(username, cancellationToken))
            throw new ConflictException($"Username '{username}' is already taken.");

        var user = User.Create(username, request.FullName, passwordHasher.Hash(request.Password));

        userRepository.Add(user);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return CreateAuthResponse(user);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetByUsernameAsync(request.Username.Trim(), cancellationToken);

        // Same error for unknown user and wrong password, so the API does not reveal which usernames exist.
        if (user is null || !passwordHasher.Verify(request.Password, user.PasswordHash))
            throw new InvalidCredentialsException();

        return CreateAuthResponse(user);
    }

    private AuthResponse CreateAuthResponse(User user)
    {
        var accessToken = tokenService.CreateToken(user);
        return new AuthResponse(accessToken.Token, accessToken.ExpiresAt, UserDto.FromEntity(user));
    }
}
