using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrderFlow.Application.Carts.Commands;
using OrderFlow.Application.Carts.Queries;
using System.Security.Claims;

namespace OrderFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly IMediator _mediator;
    public CartController(IMediator mediator) => _mediator = mediator;

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var result = await _mediator.Send(new GetCartQuery(GetUserId()));
        return Ok(result);
    }

    [HttpPost("add")]
    public async Task<IActionResult> Add([FromBody] AddToCartRequest request)
    {
        var result = await _mediator.Send(new AddToCartCommand(GetUserId(), request.ProductId, request.Quantity));
        return Ok(result);
    }

    [HttpDelete("remove/{productId}")]
    public async Task<IActionResult> Remove(Guid productId)
    {
        var result = await _mediator.Send(new RemoveFromCartCommand(GetUserId(), productId));
        return Ok(result);
    }

    [HttpPatch("update")]
    public async Task<IActionResult> UpdateQuantity([FromBody] UpdateQuantityRequest request)
    {
        var userId = GetUserId();
        var result = await _mediator.Send(new UpdateCartItemCommand(userId, request.ProductId, request.Quantity));
        return Ok(result);
    }

    public record UpdateQuantityRequest(Guid ProductId, int Quantity);
}

public record AddToCartRequest(Guid ProductId, int Quantity);