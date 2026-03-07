using MediatR;
using OrderFlow.Application.DTOs;
using OrderFlow.Application.Interfaces;
using OrderFlow.Domain.Entities;
using OrderFlow.Domain.Events;

namespace OrderFlow.Application.Orders.Commands;

public record CheckoutCommand(Guid UserId) : IRequest<OrderDto>;

public class CheckoutHandler : IRequestHandler<CheckoutCommand, OrderDto>
{
    private readonly ICartRepository _cartRepository;
    private readonly IOrderRepository _orderRepository;
    private readonly IMessagePublisher _publisher;
    private readonly IUserRepository _userRepository;

    public CheckoutHandler(
        ICartRepository cartRepository,
        IOrderRepository orderRepository,
        IMessagePublisher publisher,
        IUserRepository userRepository)
    {
        _cartRepository = cartRepository;
        _orderRepository = orderRepository;
        _publisher = publisher;
        _userRepository = userRepository;
    }

    public async Task<OrderDto> Handle(CheckoutCommand request, CancellationToken cancellationToken)
    {
        var cart = await _cartRepository.GetByUserIdAsync(request.UserId)
            ?? throw new InvalidOperationException("Sepet bulunamadı.");

        if (!cart.Items.Any())
            throw new InvalidOperationException("Sepet boş.");

        var user = await _userRepository.GetByIdAsync(request.UserId)
            ?? throw new InvalidOperationException("Kullanıcı bulunamadı.");

        var items = cart.Items.Select(i =>
            OrderItem.Create(i.Product.Name, i.Product.Price, i.Quantity)
        ).ToList();

        var order = Order.Create(user.Email, items, request.UserId);
        await _orderRepository.AddAsync(order);

        await _cartRepository.ClearAsync(request.UserId);

        await _publisher.PublishAsync(new OrderPlacedEvent(
            order.Id,
            user.Email,
            order.TotalAmount,
            order.CreatedAt
        ));

        return new OrderDto(
            order.Id,
            user.Email,
            order.Status.ToString(),
            order.TotalAmount,
            order.CreatedAt,
            order.Items.Select(i => new OrderItemDto(i.ProductName, i.UnitPrice, i.Quantity)).ToList()
        );
    }
}