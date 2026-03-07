using MediatR;
using OrderFlow.Application.DTOs;
using OrderFlow.Application.Interfaces;
using OrderFlow.Domain.Entities;

namespace OrderFlow.Application.Carts.Commands;

public record AddToCartCommand(Guid UserId, Guid ProductId, int Quantity) : IRequest<CartDto>;

public class AddToCartHandler : IRequestHandler<AddToCartCommand, CartDto>
{
    private readonly ICartRepository _cartRepository;
    private readonly IProductRepository _productRepository;

    public AddToCartHandler(ICartRepository cartRepository, IProductRepository productRepository)
    {
        _cartRepository = cartRepository;
        _productRepository = productRepository;
    }

    public async Task<CartDto> Handle(AddToCartCommand request, CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(request.ProductId)
            ?? throw new InvalidOperationException("Ürün bulunamadı.");

        var cart = await _cartRepository.GetByUserIdAsync(request.UserId);

        if (cart is null)
        {
            cart = Cart.Create(request.UserId);
            cart.AddItem(product, request.Quantity);
            await _cartRepository.AddAsync(cart);
        }
        else
        {
            cart.AddItem(product, request.Quantity);
            await _cartRepository.UpdateAsync(cart);
        }

        return CartMapper.ToDto(cart);
    }
}