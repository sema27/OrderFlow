namespace OrderFlow.Domain.Entities;

public class Order
{
    public Guid Id { get; private set; }
    public string CustomerEmail { get; private set; } = default!;
    public OrderStatus Status { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    private readonly List<OrderItem> _items = new();
    public Guid? UserId { get; private set; }
    public IReadOnlyCollection<OrderItem> Items => _items.AsReadOnly();

    public decimal TotalAmount => _items.Sum(i => i.UnitPrice * i.Quantity);

    // EF Core için
    protected Order() { }

    public static Order Create(string customerEmail, List<OrderItem> items, Guid? userId = null)
    {
        if (string.IsNullOrWhiteSpace(customerEmail))
            throw new ArgumentException("Customer email boş olamaz.");
        if (items == null || items.Count == 0)
            throw new ArgumentException("Sipariş en az bir ürün içermelidir.");

        var order = new Order
        {
            Id = Guid.NewGuid(),
            CustomerEmail = customerEmail,
            Status = OrderStatus.Pending,
            CreatedAt = DateTime.UtcNow,
            UserId = userId
        };

        order._items.AddRange(items);
        return order;
    }

    public void Confirm()
    {
        if (Status != OrderStatus.Pending)
            throw new InvalidOperationException("Sadece bekleyen siparişler onaylanabilir.");

        Status = OrderStatus.Confirmed;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Cancel()
    {
        if (Status == OrderStatus.Shipped)
            throw new InvalidOperationException("Kargoya verilen sipariş iptal edilemez.");

        Status = OrderStatus.Cancelled;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Ship()
    {
        if (Status != OrderStatus.Confirmed)
            throw new InvalidOperationException("Sadece onaylı siparişler kargoya verilebilir.");

        Status = OrderStatus.Shipped;
        UpdatedAt = DateTime.UtcNow;
    }
}