using GroceryList.Application.Abstractions.Persistence;
using GroceryList.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GroceryList.Infrastructure.Persistence.Repositories;

internal sealed class UserRepository(GroceryListDbContext dbContext) : IUserRepository
{
    public Task<User?> GetByUsernameAsync(string username, CancellationToken cancellationToken) =>
        dbContext.Users.FirstOrDefaultAsync(u => u.Username == username, cancellationToken);

    public Task<bool> UsernameExistsAsync(string username, CancellationToken cancellationToken) =>
        dbContext.Users.AnyAsync(u => u.Username == username, cancellationToken);

    public void Add(User user) => dbContext.Users.Add(user);
}
