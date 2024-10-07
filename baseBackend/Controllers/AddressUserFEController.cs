using AuthenticationJWT.DTO;
using AuthenticationJWT.Service;
using Microsoft.AspNetCore.Mvc;

namespace AuthenticationJWT.Controllers;
[Route("api/[controller]")]
[ApiController]
public class AddressUserFEController : Controller
{
    private UserAddressFEService addressFEService;

    public AddressUserFEController(UserAddressFEService addressFEService)
    {
        this.addressFEService = addressFEService;
    }

    [HttpPost]
    public IActionResult PostAdressUser(AddressUserDTO addressUserDTO)
    {
        try
        {
            if (addressFEService.PostAddress(addressUserDTO))
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

    [HttpGet("GetAdressByUser/{id}")]
    public IActionResult GetAdressByUser(int id)
    {
        try
        {
            return Ok(addressFEService.getAddressByUser(id));
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
