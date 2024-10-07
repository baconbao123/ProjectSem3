using AuthenticationJWT.Service;
using Microsoft.AspNetCore.Mvc;

namespace AuthenticationJWT.Controllers;
[Route("api/[controller]")]
[ApiController]
public class FAQFEController : Controller
{
    private FAQService fAQService;

    public FAQFEController(FAQService fAQService)
    {
        this.fAQService = fAQService;
    }

    [HttpGet]
    public IActionResult GetAllFAQs()
    {
        try
        {
            return Ok(fAQService.GetFAQs());
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
