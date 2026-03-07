using MediatR;
using OrderFlow.Application.DTOs;
using OrderFlow.Application.Interfaces;

namespace OrderFlow.Application.Carts.Commands;

public record UpdateCartItemCommand(Guid UserId, Guid ProductId, int Quantity) : IRequest<CartDto?>;

public class UpdateCartItemHandler : IRequestHandler<UpdateCartItemCommand, CartDto?>
{
    private readonly ICartRepository _cartRepository;

    public UpdateCartItemHandler(ICartRepository cartRepository)
    {
        _cartRepository = cartRepository;
    }

    public async Task<CartDto?> Handle(UpdateCartItemCommand request, CancellationToken cancellationToken)
    {
        await _cartRepository.UpdateItemQuantityAsync(request.UserId, request.ProductId, request.Quantity);
        var cart = await _cartRepository.GetByUserIdAsync(request.UserId);
        if (cart is null) return null;
        return CartMapper.ToDto(cart);
    }
}