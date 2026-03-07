using MediatR;
using OrderFlow.Application.Interfaces;
using OrderFlow.Domain.Entities;

namespace OrderFlow.Application.Favorites.Commands;

public record ToggleFavoriteCommand(Guid UserId, Guid ProductId) : IRequest<bool>;

public class ToggleFavoriteCommandHandler : IRequestHandler<ToggleFavoriteCommand, bool>
{
    private readonly IFavoriteRepository _favoriteRepository;

    public ToggleFavoriteCommandHandler(IFavoriteRepository favoriteRepository)
    {
        _favoriteRepository = favoriteRepository;
    }

    public async Task<bool> Handle(ToggleFavoriteCommand request, CancellationToken cancellationToken)
    {
        var existing = await _favoriteRepository.GetAsync(request.UserId, request.ProductId);

        if (existing is not null)
        {
            await _favoriteRepository.DeleteAsync(existing);
            return false; // favoriden çıkarıldı
        }

        await _favoriteRepository.AddAsync(Favorite.Create(request.UserId, request.ProductId));
        return true; // favoriye eklendi
    }
}