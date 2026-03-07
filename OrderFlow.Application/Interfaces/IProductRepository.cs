using OrderFlow.Domain.Entities;

namespace OrderFlow.Application.Interfaces;

public interface IProductRepository
{
    Task<Product?> GetByIdAsync(Guid id);
    Task<(IEnumerable<Product> Items, int Total)> GetAllAsync(string? search, Guid? categoryId, int page, int pageSize);
    Task AddAsync(Product product);
    Task UpdateAsync(Product product);
}