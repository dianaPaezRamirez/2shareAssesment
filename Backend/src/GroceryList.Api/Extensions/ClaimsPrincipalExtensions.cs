using System.Security.Claims;
using Microsoft.IdentityModel.JsonWebTokens;

namespace GroceryList.Api.Extensions;

public static class ClaimsPrincipalExtensions
{
    /// <summary>
    /// Returns the id of the authenticated user, taken from the "sub" claim of the validated token.
    /// </summary>
    public static Guid GetUserId(this ClaimsPrincipal principal)
    {
        var subject = principal.FindFirstValue(JwtRegisteredClaimNames.Sub);

        return Guid.TryParse(subject, out var userId)
            ? userId
            : throw new InvalidOperationException("The authenticated user does not have a valid 'sub' claim.");
    }
}
