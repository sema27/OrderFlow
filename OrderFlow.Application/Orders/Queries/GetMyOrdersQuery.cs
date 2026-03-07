using MediatR;
using OrderFlow.Application.DTOs;
using OrderFlow.Application.Interfaces;

namespace OrderFlow.Application.Orders.Queries;

public record GetMyOrdersQuery(Guid UserId) : IRequest<IEnumerable<OrderDto>>;

public class GetMyOrdersHandler : IRequestHandler<GetMyOrdersQuery, IEnumerable<OrderDto>>
{
    private readonly IOrderRepository _repository;

    public GetMyOrdersHandler(IOrderRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<OrderDto>> Handle(GetMyOrdersQuery request, CancellationToken cancellationToken)
    {
        var orders = await _repository.GetByUserIdAsync(request.UserId);
        return orders.Select(o => new OrderDto(
            o.Id,
            o.CustomerEmail,
            o.Status.ToString(),
            o.TotalAmount,
            o.CreatedAt,
            o.Items.Select(i => new OrderItemDto(i.ProductName, i.UnitPrice, i.Quantity)).ToList()
        ));
    }
}