using OrderFlow.Domain.Entities;

namespace OrderFlow.Application.Interfaces;

public interface ICartRepository
{
    Task<Cart?> GetByUserIdAsync(Guid userId);
    Task AddAsync(Cart cart);
    Task UpdateAsync(Cart cart);
    Task ClearAsync(Guid userId);
    Task UpdateItemQuantityAsync(Guid userId, Guid productId, int quantity);
}