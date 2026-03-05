using MediatR;
using OrderFlow.Application.DTOs;

namespace OrderFlow.Application.Orders.Queries;

public record GetOrderByIdQuery(Guid Id) : IRequest<OrderDto?>;