using MediatR;
using OrderFlow.Application.DTOs;
using OrderFlow.Application.Interfaces;
using OrderFlow.Domain.Entities;

namespace OrderFlow.Application.Products.Commands;

public record CreateProductCommand(
    string Name,
    string Description,
    decimal Price,
    int Stock,
    Guid CategoryId,
    string? ImageUrl
) : IRequest<ProductDto>;

public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, ProductDto>
{
    private readonly IProductRepository _repository;
    private readonly ICategoryRepository _categoryRepository;

    public CreateProductCommandHandler(IProductRepository repository, ICategoryRepository categoryRepository)
    {
        _repository = repository;
        _categoryRepository = categoryRepository;
    }

    public async Task<ProductDto> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var category = await _categoryRepository.GetByIdAsync(request.CategoryId)
            ?? throw new InvalidOperationException("Kategori bulunamadı.");

        var product = Product.Create(
            request.Name, request.Description,
            request.Price, request.Stock,
            request.CategoryId, request.ImageUrl);

        await _repository.AddAsync(product);

        return MapToDto(product, category.Name);
    }

    public static ProductDto MapToDto(Product p, string categoryName) => new(
        p.Id, p.Name, p.Description, p.Price, p.Stock,
        p.ImageUrl, categoryName, p.CategoryId, p.IsActive, p.CreatedAt);
}