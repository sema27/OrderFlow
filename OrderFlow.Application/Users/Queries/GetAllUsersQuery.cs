using MediatR;
using OrderFlow.Application.Interfaces;

namespace OrderFlow.Application.Users.Queries;

public record UserDto(Guid Id, string Email, string FirstName, string LastName, string Role, DateTime CreatedAt);

public record GetAllUsersQuery : IRequest<IEnumerable<UserDto>>;

public class GetAllUsersHandler : IRequestHandler<GetAllUsersQuery, IEnumerable<UserDto>>
{
    private readonly IUserRepository _repository;
    public GetAllUsersHandler(IUserRepository repository) => _repository = repository;

    public async Task<IEnumerable<UserDto>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
    {
        var users = await _repository.GetAllAsync();
        return users.Select(u => new UserDto(u.Id, u.Email, u.FirstName, u.LastName, u.Role.ToString(), u.CreatedAt));
    }
}