using MediatR;
using OrderFlow.Application.Interfaces;

namespace OrderFlow.Application.Orders.Commands;

public record CancelOrderCommand(Guid OrderId) : IRequest;

public class CancelOrderCommandHandler : IRequestHandler<CancelOrderCommand>
{
    private readonly IOrderRepository _repository;

    public CancelOrderCommandHandler(IOrderRepository repository)
    {
        _repository = repository;
    }

    public async Task Handle(CancelOrderCommand request, CancellationToken cancellationToken)
    {
        var order = await _repository.GetByIdAsync(request.OrderId)
            ?? throw new InvalidOperationException("Sipariş bulunamadı.");

        order.Cancel();
        await _repository.UpdateAsync(order);
    }
}
