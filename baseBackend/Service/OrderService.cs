using AuthenticationJWT.DTO;
using AuthenticationJWT.Models;

namespace AuthenticationJWT.Service;

public interface OrderService
{
    Task<Orders> CreateOrderAsync(CreateOrderDto createOrderDto, string userId);
}
