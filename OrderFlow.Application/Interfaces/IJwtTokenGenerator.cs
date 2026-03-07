using OrderFlow.Domain.Entities;

namespace OrderFlow.Application.Interfaces;

public interface IJwtTokenGenerator
{
    string GenerateToken(User user);
}