namespace GroceryList.Domain.Exceptions;

/// <summary>
/// Raised when an operation would leave a domain entity in an invalid state.
/// </summary>
public class DomainException(string message) : Exception(message);
