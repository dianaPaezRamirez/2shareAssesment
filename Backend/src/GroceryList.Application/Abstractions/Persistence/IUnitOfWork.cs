namespace GroceryList.Application.Abstractions.Persistence;

/// <summary>
/// Persists all changes tracked by the repositories in a single transaction.
/// </summary>
public interface IUnitOfWork
{
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
