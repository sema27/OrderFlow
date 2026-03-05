using MediatR;
using OrderFlow.Application.DTOs;
using OrderFlow.Application.Interfaces;

namespace OrderFlow.Application.Orders.Queries;

public class GetOrderByIdQueryHandler : IRequestHandler<GetOrderByIdQuery, OrderDto?>
{
    private readonly IOrderRepository _repository;

    public GetOrderByIdQueryHandler(IOrderRepository repository)
    {
        _repository = repository;
    }

    public async Task<OrderDto?> Handle(GetOrderByIdQuery request, CancellationToken cancellationToken)
    {
        var order = await _repository.GetByIdAsync(request.Id);
        if (order is null) return null;

        return new OrderDto(
            order.Id,
            order.CustomerEmail,
            order.Status.ToString(),
            order.TotalAmount,
            order.CreatedAt,
            order.Items.Select(i => new OrderItemDto(i.ProductName, i.UnitPrice, i.Quantity)).ToList()
        );
    }
}