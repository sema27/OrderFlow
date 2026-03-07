namespace OrderFlow.Domain.Entities;

public class Product
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = default!;
    public string Description { get; private set; } = default!;
    public decimal Price { get; private set; }
    public int Stock { get; private set; }
    public string? ImageUrl { get; private set; }
    public Guid CategoryId { get; private set; }
    public Category Category { get; private set; } = default!;
    public bool IsActive { get; private set; }
    public DateTime CreatedAt { get; private set; }

    protected Product() { }

    public static Product Create(string name, string description, decimal price, int stock, Guid categoryId, string? imageUrl = null)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Ürün adı boş olamaz.");
        if (price <= 0)
            throw new ArgumentException("Fiyat sıfırdan büyük olmalı.");
        if (stock < 0)
            throw new ArgumentException("Stok negatif olamaz.");

        return new Product
        {
            Id = Guid.NewGuid(),
            Name = name,
            Description = description,
            Price = price,
            Stock = stock,
            CategoryId = categoryId,
            ImageUrl = imageUrl,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
    }

    public void Update(string name, string description, decimal price, int stock, string? imageUrl)
    {
        Name = name;
        Description = description;
        Price = price;
        Stock = stock;
        ImageUrl = imageUrl;
    }

    public void DecreaseStock(int quantity)
    {
        if (Stock < quantity)
            throw new InvalidOperationException("Yetersiz stok.");
        Stock -= quantity;
    }

    public void IncreaseStock(int quantity) => Stock += quantity;
    public void Deactivate() => IsActive = false;
    public void Activate() => IsActive = true;
}