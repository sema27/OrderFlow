using MediatR;
using Microsoft.AspNetCore.Mvc;
using OrderFlow.Application.Orders.Commands;
using OrderFlow.Application.Orders.Queries;

namespace OrderFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IMediator _mediator;

    public OrdersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>Tüm siparişleri listeler</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var query = new GetAllOrdersQuery();
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    /// <summary>ID'ye göre sipariş getirir</summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _mediator.Send(new GetOrderByIdQuery(id));
        return result is null ? NotFound() : Ok(result);
    }

    /// <summary>Yeni sipariş oluşturur</summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderCommand command)
    {
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    /// <summary>Siparişi onayla</summary>
    [HttpPatch("{id:guid}/confirm")]
    public async Task<IActionResult> Confirm(Guid id)
    {
        await _mediator.Send(new ConfirmOrderCommand(id));
        return NoContent();
    }

    /// <summary>Siparişi iptal et</summary>
    [HttpPatch("{id:guid}/cancel")]
    public async Task<IActionResult> Cancel(Guid id)
    {
        await _mediator.Send(new CancelOrderCommand(id));
        return NoContent();
    }
}