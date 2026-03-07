using OrderFlow.Application.DTOs;
using OrderFlow.Domain.Entities;

namespace OrderFlow.Application.Carts;

public static class CartMapper
{
    public static CartDto ToDto(Cart cart) => new(
        cart.Id,
        cart.Items.Select(i => new CartItemDto(
            i.Id,
            i.ProductId,
            i.Product.Name,
            i.Product.Price,
            i.Product.ImageUrl,
            i.Quantity,
            i.Product.Price * i.Quantity
        )).ToList(),
        cart.TotalAmount
    );
}