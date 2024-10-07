using AuthenticationJWT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private MyContext db;

    public AuthController(IConfiguration configuration, MyContext myContext)
    {
        _configuration = configuration;
        db = myContext;
    }


    [HttpPost("Login")]
    public IActionResult Login([FromBody] Login request)
    {

        if (ModelState.IsValid)
        {

            var user = db.User.FirstOrDefault(item => item.Email == request.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                return Unauthorized("Invalid user credentials.");

            }
            var token = IssueToken(user);

            if (request.Remember)
            {
                user.RefreshToken = GenerateRefreshToken();
                user.Expired = DateTime.UtcNow.AddDays(int.Parse(_configuration["Jwt:ExpiredRefreshToken"]));
                db.SaveChanges();

                return Ok(new { token = token, refreshToken = user.RefreshToken });
            }
            return Ok(new { token = token });
        }
        return BadRequest("Invalid Request Body");
    }

    [HttpPost("RefreshToken")]
    public IActionResult RefreshTokenAuth(RefreshToken refreshToken)
    {
        Console.WriteLine(refreshToken.ToString());
        if (refreshToken.publicKey == null || refreshToken.publicKey != _configuration["Jwt:PublicKey"])
        {
            Console.WriteLine(refreshToken.publicKey);
            return BadRequest("Public Key");
        }

        var user = db.User.FirstOrDefault(item => item.RefreshToken == refreshToken.refreshToken && DateTime.UtcNow <= item.Expired);

        if (user == null)
        {
            return BadRequest("Invalid Token");

        }

        user.RefreshToken = GenerateRefreshToken();
        user.Expired = DateTime.UtcNow.AddDays(int.Parse(_configuration["Jwt:ExpiredRefreshToken"]));
        db.SaveChanges();
        var token = IssueToken(user);

        return Ok(new { token = token, refreshToken = user.RefreshToken });


    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> checkToken()
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;

        var id = int.Parse(userId ?? "00");

        var user = db.User.FirstOrDefault(c => c.Id == id && c.DeletedAt == null);
        return Ok(new
        {
            id = user.Id,
            name = user.Username,
            email = user.Email,
            phone = user.Phone,
            avatar = user.Avatar,
        });
    }

    private string IssueToken(User user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
        var claims = new List<Claim>
            {
                new Claim("Myapp_User_Id", user.Id.ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString())
            };


        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(int.Parse(_configuration["Jwt:DurationInMinutes"])),
            signingCredentials: credentials);
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private string GenerateRefreshToken()
    {

        using (var rng = RandomNumberGenerator.Create())
        {
            var tokenBytes = new byte[64];
            rng.GetBytes(tokenBytes);
            return Convert.ToBase64String(tokenBytes);
        }
    }

    [Authorize]
    [HttpGet("checkPermision")]
    public IActionResult Get(string resource, string action)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;
        if (userId == null)
        {
            return BadRequest(new { message = "Data not found" });
        }
        var permision = (from u in db.User
                         join map in db.MapRole on u.Id equals map.UserId
                         join role in db.Role on map.RoleId equals role.Id
                         join ma in db.MapAction on role.Id equals ma.RoleId
                         join res in db.Resource on ma.ResourceId equals res.Id
                         join ac in db.Action on ma.ActionId equals ac.Id
                         where res.Name == resource && ac.Name == action && res.DeletedAt == null
                         && u.DeletedAt == null && map.DeletedAt == null && role.DeletedAt == null
                         && ma.DeletedAt == null && u.Id == int.Parse(userId)
                         select
                         new
                         {
                             res_id = res.Id,
                             ac_id = ac.Id,
                             user_id = u.Id,
                         }
                         ).FirstOrDefault();
        if (permision == null)
        {
            return BadRequest(new { message = "Data not found" });
        }
        return Ok(new { data = permision });
    }

    [Authorize]
    [HttpGet("getPermision/{id}")]
    public IActionResult Get(int id)
    {

        var permisions = (from u in db.User
                          join map in db.MapRole on u.Id equals map.UserId
                          join role in db.Role on map.RoleId equals role.Id
                          join ma in db.MapAction on role.Id equals ma.RoleId
                          join res in db.Resource on ma.ResourceId equals res.Id
                          join ac in db.Action on ma.ActionId equals ac.Id
                          where res.DeletedAt == null
                          && u.DeletedAt == null && map.DeletedAt == null && role.DeletedAt == null
                          && ma.DeletedAt == null && u.Id == id && u.Status == 1
                          select
                          new
                          {
                              resource_id = res.Id,
                              action_id = ac.Id,
                              user_id = u.Id,
                              role_id = role.Id,
                              resource_name = res.Name,
                              action_name = ac.Name,
                          }
                         ).ToList();
        if (permisions == null)
        {
            return BadRequest(new { message = "Data not found" });
        }
        return Ok(new { data = permisions });
    }

}