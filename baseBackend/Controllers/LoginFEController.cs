using AuthenticationJWT.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace AuthenticationJWT.Controllers;
[Route("api/[controller]")]
[ApiController]
public class LoginFEController : Controller
{
    private readonly IConfiguration _configuration;
    private MyContext context;

    public LoginFEController(IConfiguration configuration, MyContext context)
    {
        _configuration = configuration;
        this.context = context;
    }

    [HttpPost]
    public IActionResult Login([FromBody] Login request)
    {

        if (ModelState.IsValid)
        {

            var user = context.User.FirstOrDefault(item => item.Email == request.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                return Unauthorized("Invalid user credentials.");

            }
            var token = IssueToken(user);

            if (request.Remember)
            {
                user.RefreshToken = GenerateRefreshToken();
                user.Expired = DateTime.UtcNow.AddDays(int.Parse(_configuration["Jwt:ExpiredRefreshToken"]));
                context.SaveChanges();

                return Ok(new { token = token, refreshToken = user.RefreshToken });
            }
            return Ok(new { token = token });
        }
        return BadRequest("Invalid Request Body");
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
}
