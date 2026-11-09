using GroceryList.Api.Extensions;
using GroceryList.Application.GroceryItems;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GroceryList.Api.Controllers;

/// <summary>
/// Grocery list of the authenticated user. The user id always comes from the access token,
/// never from the URL or the request body.
/// </summary>
[ApiController]
[Authorize]
[Route("api/grocery-items")]
[Produces("application/json")]
[ProducesResponseType(StatusCodes.Status401Unauthorized)]
public class GroceryItemsController(IGroceryItemService groceryItemService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<IReadOnlyList<GroceryItemDto>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<GroceryItemDto>>> GetAll(CancellationToken cancellationToken)
    {
        return Ok(await groceryItemService.GetAllAsync(User.GetUserId(), cancellationToken));
    }

    [HttpPost]
    [ProducesResponseType<GroceryItemDto>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<GroceryItemDto>> Add(CreateGroceryItemRequest request, CancellationToken cancellationToken)
    {
        var item = await groceryItemService.AddAsync(User.GetUserId(), request, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, item);
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Remove(Guid id, CancellationToken cancellationToken)
    {
        await groceryItemService.RemoveAsync(User.GetUserId(), id, cancellationToken);
        return NoContent();
    }

    [HttpPatch("{id:guid}/tag")]
    [ProducesResponseType<GroceryItemDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GroceryItemDto>> Tag(Guid id, CancellationToken cancellationToken)
    {
        return Ok(await groceryItemService.TagAsync(User.GetUserId(), id, cancellationToken));
    }

    [HttpPatch("{id:guid}/untag")]
    [ProducesResponseType<GroceryItemDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GroceryItemDto>> Untag(Guid id, CancellationToken cancellationToken)
    {
        return Ok(await groceryItemService.UntagAsync(User.GetUserId(), id, cancellationToken));
    }
}
