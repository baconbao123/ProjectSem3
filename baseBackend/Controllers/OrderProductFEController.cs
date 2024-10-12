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
        var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;
        var order = await orderService.CreateOrderAsync(createOrderDto, userId);
        return CreatedAtAction(nameof(PostOrder), new { id = order.Id }, order);
    }

    [HttpGet("GetOrderByUser/{id}")]
    public IActionResult GetOrderByUser(int id)
    {
        var userDB = userFEService.getUserByID(id);

        if (userDB == null)
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
                        where order.DeletedAt == null && order.UserId == userDB.Id
                        orderby order.CreatedAt descending
                        select new
                        {
                            id = order.Id,
                            user_id = user.Id,
                            user_name = user.Username,
                            user_code = user.UserCode,
                            base_price = order.BasePrice,
                            total_price = order.TotalPrice,
                            version = order.Version,
                            status = order.Status,
                            code = order.Code,
                            cancel = order.CancelAt,
                            sell_price = order.SellPrice,
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
                       x.code,
                       x.version,
                       x.status,
                       x.cancel,
                       x.user_code,
                       x.sell_price
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
                       order_code = groupResult.Key.code,
                       cancel = groupResult.Key.cancel,
                       user_code = groupResult.Key.user_code,
                       sell_price = groupResult.Key.sell_price,
                       products = groupResult
                           .Where(p => p.product != null)
                           .Select(p => new
                           {
                               product_code = p.product.Code,
                               product_id = p.product.Id,
                               product_name = p.product.Name,
                               product_image = p.product.ImageThumbPath,
                               base_price = p.orderProduct.BasePrice,
                               sell_price = p.orderProduct.ProductPrice,
                               quantity = p.orderProduct.Quantity,
                           })
                           .Distinct()
                           .ToList(),
                       sales = groupResult
                           .Where(s => s.sale != null)
                           .GroupBy(s => s.sale.Id)
                           .Select(s => new
                           {
                               sale_id = s.Key,
                               order_id = s.First().orderSale.OderId,
                               discount = s.First().sale.Discount,
                           })
                           .ToList()
                   }).ToList();

        return Ok(new { data = listData, total = listData.Count() });
    }

    [HttpGet("GetOrderById/{id}")]
    public IActionResult GetOrderById(int id)
    {
        var orderDetail = (from order in context.Orders
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
                           where order.DeletedAt == null && order.Id == id
                           orderby order.CreatedAt descending
                           select new
                           {
                               id = order.Id,
                               user_id = user.Id,
                               user_name = user.Username,
                               user_code = user.UserCode,
                               base_price = order.BasePrice,
                               total_price = order.TotalPrice,
                               code = order.Code,
                               cancel = order.CancelAt,
                               version = order.Version,
                               status = order.Status,
                               sell_price = order.SellPrice,
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
                   x.code,
                   x.version,
                   x.status,
                   x.cancel,
                   x.user_code,
                   x.sell_price
               })
               .Select(groupResult => new
               {
                   id = groupResult.Key.id,
                   user_id = groupResult.Key.user_id,
                   user_name = groupResult.Key.user_name,
                   user_code = groupResult.Key.user_code,
                   base_price = groupResult.Key.base_price,
                   total_price = groupResult.Key.total_price,
                   code = groupResult.Key.code,
                   version = groupResult.Key.version,
                   sell_price = groupResult.Key.sell_price,
                   status = groupResult.Key.status,
                   cancel = groupResult.Key.cancel,
                   products = groupResult
                       .Where(p => p.product != null)
                       .Select(p => new
                       {
                           product_code = p.product.Code,
                           product_id = p.product.Id,
                           product_name = p.product.Name,
                           product_image = p.product.ImageThumbPath,
                           base_price = p.orderProduct.BasePrice,
                           sell_price = p.orderProduct.ProductPrice,
                           quantity = p.orderProduct.Quantity,
                       })
                       .Distinct()
                       .ToList(),
                   sales = groupResult
                       .Where(s => s.sale != null)
                       .GroupBy(s => s.sale.Id)
                       .Select(s => new
                       {
                           sale_id = s.Key,
                           order_id = s.First().orderSale.OderId,
                           discount = s.First().sale.Discount,
                       })
                       .ToList()
               }).FirstOrDefault();
        if (orderDetail == null)
        {
            return BadRequest(new { message = "Data not found" });
        }


        return Ok(new { data = orderDetail });
    }





}
