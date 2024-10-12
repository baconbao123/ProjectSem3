using AuthenticationJWT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AuthenticationJWT.Controllers;
[Route("api/[controller]")]
[ApiController]
public class OrderController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private MyContext db;
    public OrderController(IConfiguration configuration, MyContext myContext)
    {
        _configuration = configuration;
        db = myContext;
    }
    // GET: api/<ResourceController>
    [HttpGet]
    [Authorize]
    public IActionResult get()
    {
        var listData = (from order in db.Orders
                        join orderProduct in db.OrderProduct on order.Id equals orderProduct.OderId into mapOrder
                        from orderProduct in mapOrder.DefaultIfEmpty()
                        join product in db.Product on orderProduct.ProductId equals product.Id into mapProduct
                        from product in mapProduct.DefaultIfEmpty()
                        join user in db.User on order.UserId equals user.Id into mapUser
                        from user in mapUser.DefaultIfEmpty()
                        join orderSale in db.OrderSale on order.Id equals orderSale.OderId into mapOrderSale
                        from orderSale in mapOrderSale.DefaultIfEmpty()
                        join sale in db.Sale on orderSale.SaleId equals sale.Id into mapSale
                        from sale in mapSale.DefaultIfEmpty()
                        where order.DeletedAt == null
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
                        }).AsEnumerable() // Switch to client-side evaluation here
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
                           .Distinct() // Ensure products are distinct
                           .ToList(),
                       sales = groupResult
                           .Where(s => s.sale != null)
                           .GroupBy(s => s.sale.Id) // Group sales by sale.Id to remove duplicates
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

    // GET api/<ResourceController>/5
    [Authorize]
    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        var orderDetail = (from order in db.Orders
                           join orderProduct in db.OrderProduct on order.Id equals orderProduct.OderId into mapOrder
                           from orderProduct in mapOrder.DefaultIfEmpty()
                           join product in db.Product on orderProduct.ProductId equals product.Id into mapProduct
                           from product in mapProduct.DefaultIfEmpty()
                           join user in db.User on order.UserId equals user.Id into mapUser
                           from user in mapUser.DefaultIfEmpty()
                           join orderSale in db.OrderSale on order.Id equals orderSale.OderId into mapOrderSale
                           from orderSale in mapOrderSale.DefaultIfEmpty()
                           join sale in db.Sale on orderSale.SaleId equals sale.Id into mapSale
                           from sale in mapSale.DefaultIfEmpty()
                           join address in db.UserAddress on order.AddressId equals address.Id into mapUserAddress
                           from address in mapUserAddress.DefaultIfEmpty()
                           join UC in db.User on order.CreatedBy equals UC.Id into mapUC
                           from UC in mapUC.DefaultIfEmpty()
                           join UU in db.User on order.UpdatedBy equals UU.Id into mapUU
                           from UU in mapUU.DefaultIfEmpty()
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
                               address_phone = address.Phone,
                               user_phone = user.Phone,
                               address = address.Address,
                               address_detail = address.DetailAddress,
                               status = order.Status,
                               sell_price = order.SellPrice,
                               user_created = UC.Username,
                               user_updated = UU.Username,
                               created_at = order.CreatedAt,
                               update_at = order.UpdateAt,
                               reason_return = order.ReasonReturn,
                               reason_cancel = order.CancelReason,
                               product,
                               orderProduct,
                               sale,
                               orderSale
                           }).AsEnumerable() // Switch to client-side evaluation here
               .GroupBy(x => new
               {
                   x.id,
                   x.user_id,
                   x.user_name,
                   x.base_price,
                   x.total_price,
                   x.version,
                   x.status,
                   x.cancel,
                   x.user_code,
                   x.code,
                   x.sell_price,
                   x.address,
                   x.address_detail,
                   x.address_phone,
                   x.user_phone,
                   x.user_created,
                   x.user_updated,
                   x.created_at,
                   x.update_at,
                   x.reason_return,
                   x.reason_cancel
               })
               .Select(groupResult => new
               {
                   id = groupResult.Key.id,
                   user_id = groupResult.Key.user_id,
                   user_name = groupResult.Key.user_name,
                   user_code = groupResult.Key.user_code,
                   base_price = groupResult.Key.base_price,
                   total_price = groupResult.Key.total_price,
                   version = groupResult.Key.version,
                   sell_price = groupResult.Key.sell_price,
                   status = groupResult.Key.status,
                   cancel = groupResult.Key.cancel,
                   address = groupResult.Key.address,
                   address_detail = groupResult.Key.address_detail,
                   address_phone = groupResult.Key.address_phone,
                   order_code = groupResult.Key.code,
                   user_phone = groupResult.Key.user_phone,
                   user_created = groupResult.Key.user_created,
                   user_updated = groupResult.Key.user_updated,
                   created_at = groupResult.Key.created_at,
                   updated_at = groupResult.Key.update_at,
                   reason_return = groupResult.Key.reason_return,
                   reason_cancel = groupResult.Key.reason_cancel,
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
                       .Distinct() // Ensure products are distinct
                       .ToList(),
                   sales = groupResult
                       .Where(s => s.sale != null)
                       .GroupBy(s => s.sale.Id) // Group sales by sale.Id to remove duplicates
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

    // POST api/<ResourceController>
    [HttpPost]
    [Authorize]
    public IActionResult Post([FromBody] RoleRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;
        var role = new Role();
        role.Name = request.Name;
        role.Description = request.Description;
        role.Status = request.Status ?? 0;
        role.Version = 0;
        role.UpdateAt = DateTime.Now;
        role.CreatedAt = DateTime.Now;
        role.UpdatedBy = int.Parse(userId);
        role.CreatedBy = int.Parse(userId);
        db.Role.Add(role);
        db.SaveChanges();
        return Ok(new { data = role });
    }

    // PUT api/<ResourceController>/5
    [Authorize]
    [HttpPut("{id}")]
    public IActionResult Put(int id, [FromBody] OrderRequest request)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;

        var order = db.Orders.FirstOrDefault(c => c.Id == id && c.DeletedAt == null);
        if (order == null)
        {
            return BadRequest(new { message = "Data not found" });
        }
        if (order.Version != request.Version)
        {
            return BadRequest(new { type = "reload", message = "Data has change pls reload" });
        }
        var status = 0;
        if (request.action == "order")
        {
            status = 1;
        }
        if (request.action == "processing")
        {
            status = 2;
        }
        else if (request.action == "completed")
        {
            status = 3;
        }
        else if (request.action == "return")
        {
            status = 4;
        }
        if (status != request.Status)
        {
            return BadRequest(new { message = "Some thing went wrong" });
        }
        order.Status = status;
        order.Version = request.Version + 1;
        order.UpdateAt = DateTime.Now;
        order.UpdatedBy = int.Parse(userId);
        db.SaveChanges();
        return Ok(new { data = order });
    }

    // DELETE api/<ResourceController>/5'
    [Authorize]
    [HttpPut("cancel/{id}")]
    public IActionResult Delete(int id, [FromBody] OrderCancel request)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;
        var order = db.Orders.FirstOrDefault(c => c.Id == id && c.DeletedAt == null);

        if (order == null)
        {
            return BadRequest(new { message = "Data not found" });
        }
        if (order.Status >= 3)
        {
            return BadRequest(new { message = "Can not cancel completed order" });
        }

        if (order.Version != request.Version)
        {
            return BadRequest(new { type = "reload", message = "Data has change pls reload" });
        }

        var orderProducts = (from op in db.OrderProduct
                             join p in db.Product on op.ProductId equals p.Id
                             where op.OderId == id
                             select new { op, p }).ToList();

        if (orderProducts.Any())
        {
            foreach (var item in orderProducts)
            {
                item.p.Quantity += item.op.Quantity;
            }
        }
        order.CancelReason = request.Cancel;
        order.CancelAt = DateTime.Now;
        order.UpdatedBy = int.Parse(userId);

        db.SaveChanges();

        return Ok(new { data = order });


    }

    [Authorize]
    [HttpPut("return/{id}")]
    public IActionResult Return(int id, [FromBody] OrderReturn request)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;
        var order = db.Orders.FirstOrDefault(c => c.Id == id && c.DeletedAt == null);

        if (order == null)
        {
            return BadRequest(new { message = "Data not found" });
        }
        if (order.Status < 2)
        {
            return BadRequest(new { message = "Can not return  order hasnt completed" });
        }

        if (order.Version != request.Version)
        {
            return BadRequest(new { type = "reload", message = "Data has change pls reload" });
        }

        var orderProducts = (from op in db.OrderProduct
                             join p in db.Product on op.ProductId equals p.Id
                             where op.OderId == id
                             select new { op, p }).ToList();

        if (orderProducts.Any())
        {
            foreach (var item in orderProducts)
            {
                item.p.Quantity += item.op.Quantity;
            }
        }
        order.ReasonReturn = request.returnReason;
        order.Status = 4;
        order.UpdatedBy = int.Parse(userId);

        db.SaveChanges();

        return Ok(new { data = order });


    }
}
