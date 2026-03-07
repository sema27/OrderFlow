namespace OrderFlow.Application.DTOs;

public record CartDto(
    Guid Id,
    List<CartItemDto> Items,
    decimal TotalAmount
);

public record CartItemDto(
    Guid Id,
    Guid ProductId,
    string ProductName,
    decimal UnitPrice,
    string? ImageUrl,
    int Quantity,
    decimal SubTotal
);