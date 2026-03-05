namespace OrderFlow.Domain.Events;

// RabbitMQ'ya publish edeceğimiz event — Phase 3'te kullanacağız
public record OrderPlacedEvent(
    Guid OrderId,
    string CustomerEmail,
    decimal TotalAmount,
    DateTime PlacedAt
);
