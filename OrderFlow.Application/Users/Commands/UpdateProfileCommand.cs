using MediatR;
using OrderFlow.Application.Interfaces;

namespace OrderFlow.Application.Users.Commands;

public record UpdateProfileCommand(Guid UserId, string FirstName, string LastName) : IRequest;

public class UpdateProfileHandler : IRequestHandler<UpdateProfileCommand>
{
    private readonly IUserRepository _repository;

    public UpdateProfileHandler(IUserRepository repository)
    {
        _repository = repository;
    }

    public async Task Handle(UpdateProfileCommand request, CancellationToken cancellationToken)
    {
        var user = await _repository.GetByIdAsync(request.UserId)
            ?? throw new InvalidOperationException("Kullanıcı bulunamadı.");

        user.UpdateInfo(request.FirstName, request.LastName);
        await _repository.UpdateAsync(user);
    }
}