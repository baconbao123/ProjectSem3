using AuthenticationJWT.Models;
using Microsoft.AspNetCore.Mvc;

namespace AuthenticationJWT.Controllers;
[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{

    private MyContext db;

    public UserController(MyContext myContext)
    {
        db = myContext;

    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var dataStudent = db.User.ToList();
        return Ok(dataStudent);
    }

    [HttpPost]
    //[Authorize]
    public IActionResult Create(UserRequest user)
    {
        var password = BCrypt.Net.BCrypt.HashPassword(user.Password);
        var existEmail = db.User.FirstOrDefault(item => item.Email == user.Email);

        if (existEmail != null)
        {
            return BadRequest("Email is already exist");
        }

        var element = new User
        {
            Email = user.Email,
            Password = password,
            Username = user.UserName
        };

        try
        {
            db.User.Add(element);
            db.SaveChanges();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.ToString());
        }

        return Ok(element);
    }



}
