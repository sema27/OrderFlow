namespace OrderFlow.Domain.Entities;

public class OrderItem
{
    public Guid Id { get; private set; }
    public Guid OrderId { get; private set; }
    public string ProductName { get; private set; } = default!;
    public decimal UnitPrice { get; private set; }
    public int Quantity { get; private set; }

    protected OrderItem() { }

    public static OrderItem Create(string productName, decimal unitPrice, int quantity)
    {
        if (unitPrice <= 0) throw new ArgumentException("Fiyat sıfırdan büyük olmalı.");
        if (quantity <= 0) throw new ArgumentException("Adet sıfırdan büyük olmalı.");

        return new OrderItem
        {
            Id = Guid.NewGuid(),
            ProductName = productName,
            UnitPrice = unitPrice,
            Quantity = quantity
        };
    }
}