using Microsoft.EntityFrameworkCore;
using OrderFlow.Domain.Entities;

namespace OrderFlow.Infrastructure.Persistence;

public class OrderFlowDbContext : DbContext
{
    public OrderFlowDbContext(DbContextOptions<OrderFlowDbContext> options) : base(options) { }

    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(o => o.Id);

            entity.Property(o => o.CustomerEmail)
                .IsRequired()
                .HasMaxLength(256);

            entity.Property(o => o.Status)
                .HasConversion<string>()  // DB'de "Pending", "Confirmed" gibi saklanır
                .HasMaxLength(20);

            entity.Ignore(o => o.TotalAmount);

            // _items private field'ını EF Core'a tanıt
            entity.HasMany(o => o.Items)
                .WithOne()
                .HasForeignKey(i => i.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(i => i.Id);

            entity.Property(i => i.ProductName)
                .IsRequired()
                .HasMaxLength(256);

            entity.Property(i => i.UnitPrice)
                .HasColumnType("numeric(18,2)");
        });
    }
}