using MediatR;

namespace OrderFlow.Application.Auth.Commands;

public record RegisterCommand(
    string Email,
    string Password,
    string FirstName,
    string LastName
) : IRequest<AuthResponseDto>;

public record AuthResponseDto(
    string Token,
    string Email,
    string FullName,
    string Role
);