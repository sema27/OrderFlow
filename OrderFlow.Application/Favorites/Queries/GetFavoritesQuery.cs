using MediatR;
using OrderFlow.Application.DTOs;
using OrderFlow.Application.Interfaces;

namespace OrderFlow.Application.Favorites.Queries;

public record GetFavoritesQuery(Guid UserId) : IRequest<IEnumerable<ProductDto>>;

public class GetFavoritesQueryHandler : IRequestHandler<GetFavoritesQuery, IEnumerable<ProductDto>>
{
    private readonly IFavoriteRepository _favoriteRepository;

    public GetFavoritesQueryHandler(IFavoriteRepository favoriteRepository)
    {
        _favoriteRepository = favoriteRepository;
    }

    public async Task<IEnumerable<ProductDto>> Handle(GetFavoritesQuery request, CancellationToken cancellationToken)
    {
        var favorites = await _favoriteRepository.GetByUserIdAsync(request.UserId);
        return favorites.Select(f => new ProductDto(
            f.Product.Id, f.Product.Name, f.Product.Description,
            f.Product.Price, f.Product.Stock, f.Product.ImageUrl,
            f.Product.Category.Name, f.Product.CategoryId,
            f.Product.IsActive, f.Product.CreatedAt
        ));
    }
}