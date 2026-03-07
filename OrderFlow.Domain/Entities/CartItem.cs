namespace OrderFlow.Domain.Entities;

public class CartItem
{
    public Guid Id { get; private set; }
    public Guid CartId { get; private set; }
    public Guid ProductId { get; private set; }
    public Product Product { get; private set; } = default!;
    public Cart Cart { get; private set; } = default!;
    public int Quantity { get; private set; }

    protected CartItem() { }

    public static CartItem Create(Guid cartId, Guid productId, int quantity) => new()
    {
        Id = Guid.NewGuid(),
        CartId = cartId,
        ProductId = productId,
        Quantity = quantity
    };

    public void IncreaseQuantity(int quantity) => Quantity += quantity;
    public void UpdateQuantity(int quantity)
    {
        if (quantity <= 0) throw new ArgumentException("Adet sıfırdan büyük olmalı.");
        Quantity = quantity;
    }
}