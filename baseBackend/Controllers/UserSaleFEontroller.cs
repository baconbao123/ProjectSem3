using AuthenticationJWT.DTO;
using AuthenticationJWT.Service;
using Microsoft.AspNetCore.Mvc;

namespace AuthenticationJWT.Controllers;
[Route("api/[controller]")]
[ApiController]
public class UserSaleFEController : Controller
{
    private UserSaleFEService userSaleFEService;

    public UserSaleFEController(UserSaleFEService userSaleFEService)
    {
        this.userSaleFEService = userSaleFEService;
    }

    [HttpPost]
    public IActionResult UserGetVoucher([FromBody] UserSaleDTO userSaleDTO)
    {
        try
        {
            var result = userSaleFEService.AddSaleToUser(userSaleDTO);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
