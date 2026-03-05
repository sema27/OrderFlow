namespace OrderFlow.Application.DTOs;

public record OrderDto(
    Guid Id,
    string CustomerEmail,
    string Status,
    decimal TotalAmount,
    DateTime CreatedAt,
    List<OrderItemDto> Items
);

public record OrderItemDto(
    string ProductName,
    decimal UnitPrice,
    int Quantity
);
