using FluentValidation;

namespace OrderFlow.Application.Orders.Commands;

public class CreateOrderCommandValidator : AbstractValidator<CreateOrderCommand>
{
    public CreateOrderCommandValidator()
    {
        RuleFor(x => x.CustomerEmail)
            .NotEmpty().WithMessage("Email boş olamaz.")
            .EmailAddress().WithMessage("Geçerli bir email giriniz.");

        RuleFor(x => x.Items)
            .NotEmpty().WithMessage("Sipariş en az bir ürün içermelidir.");

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(x => x.ProductName).NotEmpty().WithMessage("Ürün adı boş olamaz.");
            item.RuleFor(x => x.UnitPrice).GreaterThan(0).WithMessage("Fiyat sıfırdan büyük olmalı.");
            item.RuleFor(x => x.Quantity).GreaterThan(0).WithMessage("Adet sıfırdan büyük olmalı.");
        });
    }
}