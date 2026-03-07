namespace OrderFlow.Application.DTOs;

public record ProductDto(
    Guid Id,
    string Name,
    string Description,
    decimal Price,
    int Stock,
    string? ImageUrl,
    string CategoryName,
    Guid CategoryId,
    bool IsActive,
    DateTime CreatedAt
);

public record CategoryDto(
    Guid Id,
    string Name,
    string Slug,
    int ProductCount
);
