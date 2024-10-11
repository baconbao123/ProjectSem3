using AuthenticationJWT.DTO;
using AuthenticationJWT.Models;

namespace AuthenticationJWT.Service;

public class OrderServiceImpl : OrderService
{
    private MyContext context;

    public OrderServiceImpl(MyContext context)
    {
        this.context = context;
    }

    public async Task<Orders> CreateOrderAsync(CreateOrderDto createOrderDto)
    {
        var order = new Orders
        {
            UserId = createOrderDto.UserId,
            AddressId = createOrderDto.AddressId,
            BasePrice = createOrderDto.BasePrice,
            TotalPrice = "0",
            CreatedAt = DateTime.Now,
            UpdateAt = DateTime.Now,
            Code = Guid.NewGuid().ToString(),
        };

        await context.Orders.AddAsync(order);
        await context.SaveChangesAsync();

        var orderProducts = createOrderDto.Products.Select(productDTO => new OrderProduct
        {

            OderId = order.Id,
            ProductId = productDTO.ProductId,
            Quantity = productDTO.Quantity,
            BasePrice = (productDTO.Quantity * productDTO.SellPrice).ToString(),
            ProductPrice = "0",
            CreatedAt = DateTime.Now,
            UpdateAt = DateTime.Now
        }).ToList();

        await context.OrderProduct.AddRangeAsync(orderProducts);

        await context.SaveChangesAsync();
        return order;
    }
}
