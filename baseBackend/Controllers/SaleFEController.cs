using Microsoft.AspNetCore.Mvc;

namespace AuthenticationJWT.Controllers;
[Route("api/[controller]")]
[ApiController]
public class SaleFEController : Controller
{
    private MyContext context;

    public SaleFEController(MyContext context)
    {
        this.context = context;
    }

    [HttpGet]
    public IActionResult GetAllVoucher()
    {
        var listData = (from item in context.Sale
                        where item.DeletedAt == null
                        orderby item.CreatedAt descending
                        select item).ToList();

        return Ok(new { data = listData, total = listData.Count() });
    }
}
