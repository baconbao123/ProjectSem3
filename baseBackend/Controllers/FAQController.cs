using AuthenticationJWT.DTO;
using AuthenticationJWT.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuthenticationJWT.Controllers;
[Route("api/[controller]")]
[ApiController]
[Authorize]
public class FAQController : Controller
{
    private FAQService fAQService;

    public FAQController(FAQService fAQService)
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

    [HttpPost]
    public IActionResult PostAllFAQs([FromBody] FAQDTO fAQDTO)
    {
        try
        {
            if (fAQService.PostFAQ(fAQDTO))
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
