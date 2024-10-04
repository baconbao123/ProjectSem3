using AuthenticationJWT.DTO;
using AuthenticationJWT.Service;
using Microsoft.AspNetCore.Mvc;

namespace AuthenticationJWT.Controllers;
[Route("api/[controller]")]
[ApiController]
public class UserFEController : Controller
{
    private UserFEService userFEService;

    public UserFEController(UserFEService userFEService)
    {
        this.userFEService = userFEService;
    }

    [HttpGet]
    public IActionResult GetAllUser()
    {
        try
        {
            var users = userFEService.getAllUser();
            return Ok(users);
        }
        catch
        {
            return BadRequest();
        }
    }

    [HttpPost]
    public IActionResult PostRegisterUser([FromBody] UserRegisterDTO userRegisterDTO)
    {
        try
        {
            if (userFEService.PostRegisterUser(userRegisterDTO))
            {
                return Ok();
            }
            else
            {

                return BadRequest();
            }
        }
        catch
        {
            return BadRequest();
        }
    }

    [HttpPut]
    public IActionResult UserUpdate([FromForm] UserUpdateDTO userUpdateDTO)
    {
        try
        {
            if (userFEService.UpdateUser(userUpdateDTO))
            {
                return Ok();
            }
            else
            {

                return BadRequest();
            }
        }
        catch
        {
            return BadRequest();
        }
    }

    [HttpGet("getUserById/{id}")]
    public IActionResult GetUserById(int id)
    {
        try
        {
            return Ok(userFEService.getUserByID(id));
        }
        catch
        {
            return BadRequest();
        }
    }
}
