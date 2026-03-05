using MediatR;
using OrderFlow.Application.Interfaces;

namespace OrderFlow.Application.Orders.Commands;

public record ConfirmOrderCommand(Guid OrderId) : IRequest;

public class ConfirmOrderCommandHandler : IRequestHandler<ConfirmOrderCommand>
{
    private readonly IOrderRepository _repository;
    private readonly IMessagePublisher _publisher;

    public ConfirmOrderCommandHandler(IOrderRepository repository, IMessagePublisher publisher)
    {
        _repository = repository;
        _publisher = publisher;
    }

    public async Task Handle(ConfirmOrderCommand request, CancellationToken cancellationToken)
    {
        var order = await _repository.GetByIdAsync(request.OrderId)
            ?? throw new InvalidOperationException("Sipariş bulunamadı.");

        order.Confirm();
        await _repository.UpdateAsync(order);
    }
}