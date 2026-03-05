using MediatR;
using OrderFlow.Application.DTOs;

namespace OrderFlow.Application.Orders.Commands;

public record CreateOrderCommand(
    string CustomerEmail,
    List<CreateOrderItemDto> Items
) : IRequest<OrderDto>;

public record CreateOrderItemDto(
    string ProductName,
    decimal UnitPrice,
    int Quantity
);