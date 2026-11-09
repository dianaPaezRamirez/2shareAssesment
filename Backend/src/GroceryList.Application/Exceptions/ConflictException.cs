namespace GroceryList.Application.Exceptions;

/// <summary>
/// Raised when an operation conflicts with the current state, such as a duplicated username.
/// </summary>
public class ConflictException(string message) : Exception(message);
