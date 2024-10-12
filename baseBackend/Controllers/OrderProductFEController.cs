using AuthenticationJWT.DTO;
using AuthenticationJWT.Service;
using Microsoft.AspNetCore.Mvc;

namespace AuthenticationJWT.Controllers;
[Route("api/[controller]")]
[ApiController]
public class OrderProductFEController : Controller
{
    private MyContext context;
    private OrderService orderService;
    private UserFEService userFEService;

    public OrderProductFEController(MyContext context, OrderService orderService, UserFEService userFEService)
    {
        this.context = context;
        this.orderService = orderService;
        this.userFEService = userFEService;
    }

    [HttpPost]
    public async Task<IActionResult> PostOrder([FromBody] CreateOrderDto createOrderDto)
    {
        if (createOrderDto == null)
        {
            return BadRequest("Invalid order data.");
        }

        var order = await orderService.CreateOrderAsync(createOrderDto);
        return CreatedAtAction(nameof(PostOrder), new { id = order.Id }, order);
    }

    [HttpGet("GetOrderByUser/{id}")]
    public IActionResult GetOrderByUser(int id)
    {
        var userFromDb = userFEService.getUserByID(id);

        if (userFromDb == null)
        {
            return NotFound(new { message = "User not found." });
        }

        var listData = (from order in context.Orders
                        join orderProduct in context.OrderProduct on order.Id equals orderProduct.OderId into mapOrder
                        from orderProduct in mapOrder.DefaultIfEmpty()
                        join product in context.Product on orderProduct.ProductId equals product.Id into mapProduct
                        from product in mapProduct.DefaultIfEmpty()
                        join user in context.User on order.UserId equals user.Id into mapUser
                        from user in mapUser.DefaultIfEmpty()
                        join orderSale in context.OrderSale on order.Id equals orderSale.OderId into mapOrderSale
                        from orderSale in mapOrderSale.DefaultIfEmpty()
                        join sale in context.Sale on orderSale.SaleId equals sale.Id into mapSale
                        from sale in mapSale.DefaultIfEmpty()
                        where order.DeletedAt == null && order.UserId == id
                        orderby order.CreatedAt descending
                        select new
                        {
                            id = order.Id,
                            user_id = user.Id,
                            user_name = user.Username,
                            base_price = order.BasePrice,
                            total_price = order.TotalPrice,
                            version = order.Version,
                            status = order.Status,
                            product,
                            orderProduct,
                            sale,
                            orderSale
                        }).AsEnumerable()
                    .GroupBy(x => new
                    {
                        x.id,
                        x.user_id,
                        x.user_name,
                        x.base_price,
                        x.total_price,
                        x.version,
                        x.status
                    })
                    .Select(groupResult => new
                    {
                        id = groupResult.Key.id,
                        user_id = groupResult.Key.user_id,
                        user_name = groupResult.Key.user_name,
                        base_price = groupResult.Key.base_price,
                        total_price = groupResult.Key.total_price,
                        version = groupResult.Key.version,
                        status = groupResult.Key.status,
                        products = groupResult
                            .Where(p => p.product != null)
                            .Select(p => new
                            {
                                product_code = p.product.Code,
                                product_id = p.product.Id,
                                product_name = p.product.Name,
                                product_image = p.product.ImageThumbPath,
                                base_price = p.orderProduct.BasePrice,
                                sell_price = p.orderProduct.SellPrice,
                                quantity = p.orderProduct.Quantity,
                            })
                            .Distinct() // Đảm bảo các sản phẩm là duy nhất
                            .ToList(),
                        sales = groupResult
                            .Where(s => s.sale != null)
                            .GroupBy(s => s.sale.Id) // Nhóm các sale theo sale.Id để loại bỏ bản sao
                            .Select(s => new
                            {
                                sale_id = s.Key,
                                order_id = s.First().orderSale.OderId,
                                discount = s.First().sale.Discount,
                            })
                            .ToList()
                    }).ToList();

        if (!listData.Any())
        {
            return Ok(new { message = "No orders found for this user." });
        }

        return Ok(new { user = new { userFromDb.Id, userFromDb.Username }, data = listData, total = listData.Count() });
    }




}
