using MediatR;
using OrderFlow.Application.DTOs;
using OrderFlow.Application.Interfaces;
using OrderFlow.Domain.Entities;
using OrderFlow.Domain.Events;

namespace OrderFlow.Application.Orders.Commands;

public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, OrderDto>
{
    private readonly IOrderRepository _repository;
    private readonly IMessagePublisher _publisher;

    public CreateOrderCommandHandler(IOrderRepository repository, IMessagePublisher publisher)
    {
        _repository = repository;
        _publisher = publisher;
    }

    public async Task<OrderDto> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        // Domain nesnesi oluştur
        var items = request.Items
            .Select(i => OrderItem.Create(i.ProductName, i.UnitPrice, i.Quantity))
            .ToList();

        var order = Order.Create(request.CustomerEmail, items);

        // Kaydet
        await _repository.AddAsync(order);

        // RabbitMQ'ya event gönder
        await _publisher.PublishAsync(new OrderPlacedEvent(
            order.Id,
            order.CustomerEmail,
            order.TotalAmount,
            order.CreatedAt
        ));

        return MapToDto(order);
    }

    private static OrderDto MapToDto(Order order) => new(
        order.Id,
        order.CustomerEmail,
        order.Status.ToString(),
        order.TotalAmount,
        order.CreatedAt,
        order.Items.Select(i => new OrderItemDto(i.ProductName, i.UnitPrice, i.Quantity)).ToList()
    );
}