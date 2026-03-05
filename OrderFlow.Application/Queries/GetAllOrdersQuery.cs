using MediatR;
using OrderFlow.Application.DTOs;
using OrderFlow.Application.Interfaces;

namespace OrderFlow.Application.Orders.Queries;

public record GetAllOrdersQuery : IRequest<IEnumerable<OrderDto>>;

public class GetAllOrdersQueryHandler : IRequestHandler<GetAllOrdersQuery, IEnumerable<OrderDto>>
{
    private readonly IOrderRepository _repository;

    public GetAllOrdersQueryHandler(IOrderRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<OrderDto>> Handle(GetAllOrdersQuery request, CancellationToken cancellationToken)
    {
        var orders = await _repository.GetAllAsync();
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