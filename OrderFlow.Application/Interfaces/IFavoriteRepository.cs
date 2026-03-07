using OrderFlow.Domain.Entities;

namespace OrderFlow.Application.Interfaces;

public interface IFavoriteRepository
{
    Task<IEnumerable<Favorite>> GetByUserIdAsync(Guid userId);
    Task<Favorite?> GetAsync(Guid userId, Guid productId);
    Task AddAsync(Favorite favorite);
    Task DeleteAsync(Favorite favorite);
}