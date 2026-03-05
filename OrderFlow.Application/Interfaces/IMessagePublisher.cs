namespace OrderFlow.Application.Interfaces;

// RabbitMQ publish işlemi için soyutlama — Infrastructure bunu implemente edecek
public interface IMessagePublisher
{
    Task PublishAsync<T>(T message) where T : class;
}