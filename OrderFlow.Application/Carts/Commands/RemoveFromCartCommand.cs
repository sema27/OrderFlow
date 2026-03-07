using MediatR;
using OrderFlow.Application.DTOs;
using OrderFlow.Application.Interfaces;

namespace OrderFlow.Application.Carts.Commands;

public record RemoveFromCartCommand(Guid UserId, Guid ProductId) : IRequest<CartDto>;

public class RemoveFromCartHandler : IRequestHandler<RemoveFromCartCommand, CartDto>
{
    private readonly ICartRepository _cartRepository;

    public RemoveFromCartHandler(ICartRepository cartRepository)
    {
        _cartRepository = cartRepository;
    }

    public async Task<CartDto> Handle(RemoveFromCartCommand request, CancellationToken cancellationToken)
    {
        var cart = await _cartRepository.GetByUserIdAsync(request.UserId)
            ?? throw new InvalidOperationException("Sepet bulunamadı.");

        cart.RemoveItem(request.ProductId);
        await _cartRepository.UpdateAsync(cart);

        return CartMapper.ToDto(cart);
    }
}