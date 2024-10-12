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

    public async Task<Orders> CreateOrderAsync(CreateOrderDto createOrderDto, string userId)
    {
        float totalBasePrice = createOrderDto.Products.Sum(p => p.BasePrice * p.Quantity);
        float totalSellPrice = createOrderDto.Products.Sum(p => p.SellPrice * p.Quantity);
        var order = new Orders
        {
            UserId = createOrderDto.UserId,
            AddressId = createOrderDto.AddressId,
            BasePrice = totalBasePrice.ToString(),
            TotalPrice = totalSellPrice.ToString(),
            SellPrice = totalSellPrice.ToString(),
            CreatedAt = DateTime.Now,
            UpdateAt = DateTime.Now,
            Status = 1,
            Code = DateTime.Now.ToString("ddHHmmss"),
        };

        await context.Orders.AddAsync(order);
        await context.SaveChangesAsync();

        var orderProducts = createOrderDto.Products.Select(productDTO => new OrderProduct
        {

            OderId = order.Id,
            ProductId = productDTO.ProductId,
            Quantity = productDTO.Quantity,
            BasePrice = (productDTO.Quantity * productDTO.BasePrice).ToString(),
            ProductPrice = productDTO.SellPrice.ToString(),
            CreatedAt = DateTime.Now,
            UpdateAt = DateTime.Now
        }).ToList();

        await context.OrderProduct.AddRangeAsync(orderProducts);

        await context.SaveChangesAsync();
        return order;
    }
}
