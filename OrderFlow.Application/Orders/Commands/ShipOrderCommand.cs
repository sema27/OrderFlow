using MediatR;
using OrderFlow.Application.Interfaces;

namespace OrderFlow.Application.Orders.Commands;

public record ShipOrderCommand(Guid OrderId) : IRequest;

public class ShipOrderHandler : IRequestHandler<ShipOrderCommand>
{
    private readonly IOrderRepository _repository;

    public ShipOrderHandler(IOrderRepository repository)
    {
        _repository = repository;
    }

    public async Task Handle(ShipOrderCommand request, CancellationToken cancellationToken)
    {
        var order = await _repository.GetByIdAsync(request.OrderId)
            ?? throw new InvalidOperationException("Sipariş bulunamadı.");

        order.Ship();
        await _repository.UpdateAsync(order);
    }
}