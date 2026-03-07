using Microsoft.EntityFrameworkCore;
using OrderFlow.Application.Interfaces;
using OrderFlow.Domain.Entities;
using OrderFlow.Infrastructure.Persistence;

namespace OrderFlow.Infrastructure.Repositories;

public class FavoriteRepository : IFavoriteRepository
{
    private readonly OrderFlowDbContext _context;
    public FavoriteRepository(OrderFlowDbContext context) => _context = context;

    public async Task<IEnumerable<Favorite>> GetByUserIdAsync(Guid userId)
        => await _context.Favorites
            .Include(f => f.Product)
            .ThenInclude(p => p.Category)
            .Where(f => f.UserId == userId)
            .ToListAsync();

    public async Task<Favorite?> GetAsync(Guid userId, Guid productId)
        => await _context.Favorites
            .FirstOrDefaultAsync(f => f.UserId == userId && f.ProductId == productId);

    public async Task AddAsync(Favorite favorite)
    {
        await _context.Favorites.AddAsync(favorite);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Favorite favorite)
    {
        _context.Favorites.Remove(favorite);
        await _context.SaveChangesAsync();
    }
}
