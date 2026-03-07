using Microsoft.EntityFrameworkCore;
using OrderFlow.Application.Interfaces;
using OrderFlow.Domain.Entities;
using OrderFlow.Infrastructure.Persistence;

namespace OrderFlow.Infrastructure.Repositories;

public class CartRepository : ICartRepository
{
    private readonly OrderFlowDbContext _context;
    public CartRepository(OrderFlowDbContext context) => _context = context;

    public async Task<Cart?> GetByUserIdAsync(Guid userId)
        => await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .ThenInclude(p => p.Category)
            .FirstOrDefaultAsync(c => c.UserId == userId);

    public async Task AddAsync(Cart cart)
    {
        await _context.Carts.AddAsync(cart);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Cart cart)
    {
        // Yeni item'ları ekle
        foreach (var item in cart.Items)
        {
            var exists = await _context.CartItems.AnyAsync(i => i.Id == item.Id);
            if (!exists)
                await _context.CartItems.AddAsync(item);
        }
        await _context.SaveChangesAsync();
    }

    public async Task ClearAsync(Guid userId)
    {
        var cart = await _context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart != null)
        {
            _context.CartItems.RemoveRange(cart.Items);
            await _context.SaveChangesAsync();
        }
    }

    public async Task UpdateItemQuantityAsync(Guid userId, Guid productId, int quantity)
    {
        var item = await _context.CartItems
            .FirstOrDefaultAsync(i => i.Cart.UserId == userId && i.ProductId == productId);

        if (item is null) return;

        if (quantity <= 0)
            _context.CartItems.Remove(item);
        else
            item.UpdateQuantity(quantity);

        await _context.SaveChangesAsync();
    }
}