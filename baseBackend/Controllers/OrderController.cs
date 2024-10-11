﻿using AuthenticationJWT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
                            base_price = order.BasePrice,
                            total_price = order.TotalPrice,
                            version = order.Version,
                            status = order.Status,
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
        var role = (from r in db.Role
                    join u in db.User on r.CreatedBy equals u.Id
                    where r.Id == id && r.DeletedAt == null
                    select new
                    {
                        Resource = r,
                        User = u
                    }).FirstOrDefault();

        if (role == null)
        {
            return BadRequest(new { message = "Data not found" });
        }
        return Ok(new { data = role });
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
    public IActionResult Put(int id, [FromBody] RoleRequest request)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;

        var role = db.Role.FirstOrDefault(c => c.Id == id && c.DeletedAt == null);
        if (role == null)
        {
            return BadRequest(new { message = "Data not found" });
        }
        if (role.Version != request.Version)
        {
            return BadRequest(new { type = "reload", message = "Data has change pls reload" });
        }
        role.Name = request.Name;
        role.Description = request.Description;
        role.Status = request.Status ?? 0;
        role.Version = request.Version + 1;
        role.UpdateAt = DateTime.Now;
        role.UpdatedBy = int.Parse(userId);
        db.SaveChanges();
        return Ok(new { data = role });
    }

    // DELETE api/<ResourceController>/5'
    [Authorize]
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;
        var role = db.Role.FirstOrDefault(c => c.Id == id && c.DeletedAt == null);
        if (role == null)
        {
            return BadRequest(new { message = "Data not found" });
        }
        role.DeletedAt = DateTime.Now;
        role.UpdatedBy = int.Parse(userId);
        db.SaveChanges();
        return Ok(new { data = role });

    }
}
