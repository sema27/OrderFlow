using MassTransit;
using Microsoft.Extensions.Logging;
using OrderFlow.Domain.Events;

namespace OrderFlow.NotificationWorker.Consumers;

public class OrderPlacedConsumer : IConsumer<OrderPlacedEvent>
{
    private readonly ILogger<OrderPlacedConsumer> _logger;

    public OrderPlacedConsumer(ILogger<OrderPlacedConsumer> logger)
    {
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<OrderPlacedEvent> context)
    {
        var order = context.Message;

        _logger.LogInformation(
            "📦 Yeni sipariş alındı! OrderId: {OrderId}, Customer: {Email}, Tutar: {Amount} TL",
            order.OrderId,
            order.CustomerEmail,
            order.TotalAmount
        );

        // İleride buraya gerçek email gönderimi gelecek
        await Task.CompletedTask;
    }
}