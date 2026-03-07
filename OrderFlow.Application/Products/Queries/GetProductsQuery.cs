using MediatR;
using OrderFlow.Application.DTOs;
using OrderFlow.Application.Interfaces;

namespace OrderFlow.Application.Products.Queries;

public record GetProductsQuery(
    string? Search,
    Guid? CategoryId,
    int Page = 1,
    int PageSize = 12
) : IRequest<PagedResult<ProductDto>>;

public record PagedResult<T>(
    IEnumerable<T> Items,
    int Total,
    int Page,
    int PageSize
);

public class GetProductsQueryHandler : IRequestHandler<GetProductsQuery, PagedResult<ProductDto>>
{
    private readonly IProductRepository _repository;

    public GetProductsQueryHandler(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<PagedResult<ProductDto>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
    {
        var (items, total) = await _repository.GetAllAsync(
            request.Search, request.CategoryId, request.Page, request.PageSize);

        var dtos = items.Select(p => new ProductDto(
            p.Id, p.Name, p.Description, p.Price, p.Stock,
            p.ImageUrl, p.Category.Name, p.CategoryId, p.IsActive, p.CreatedAt));

        return new PagedResult<ProductDto>(dtos, total, request.Page, request.PageSize);
    }
}