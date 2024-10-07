using AuthenticationJWT.DTO;
using AuthenticationJWT.Service;
using Microsoft.AspNetCore.Mvc;

namespace AuthenticationJWT.Controllers;
[Route("api/[controller]")]
[ApiController]
public class OrderProductFEController : Controller
{
    private OrderService orderService;

    public OrderProductFEController(OrderService orderService)
    {
        this.orderService = orderService;
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
}
