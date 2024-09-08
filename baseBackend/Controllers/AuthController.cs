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
    public IActionResult checkToken()
    {
        return Ok("Oke");
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

        user.Roles.ForEach(role => claims.Add(new Claim(ClaimTypes.Role, role)));

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