using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrderFlow.Application.Favorites.Commands;
using OrderFlow.Application.Favorites.Queries;
using System.Security.Claims;

namespace OrderFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FavoritesController : ControllerBase
{
    private readonly IMediator _mediator;
    public FavoritesController(IMediator mediator) => _mediator = mediator;

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var result = await _mediator.Send(new GetFavoritesQuery(GetUserId()));
        return Ok(result);
    }

    [HttpPost("toggle/{productId}")]
    public async Task<IActionResult> Toggle(Guid productId)
    {
        var added = await _mediator.Send(new ToggleFavoriteCommand(GetUserId(), productId));
        return Ok(new { added, message = added ? "Favorilere eklendi" : "Favorilerden çıkarıldı" });
    }
}