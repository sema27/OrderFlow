namespace OrderFlow.Domain.Entities;

public class Favorite
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public Guid ProductId { get; private set; }
    public Product Product { get; private set; } = default!;
    public DateTime CreatedAt { get; private set; }

    protected Favorite() { }

    public static Favorite Create(Guid userId, Guid productId) => new()
    {
        Id = Guid.NewGuid(),
        UserId = userId,
        ProductId = productId,
        CreatedAt = DateTime.UtcNow
    };
}