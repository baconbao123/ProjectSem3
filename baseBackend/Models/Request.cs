using System.ComponentModel.DataAnnotations;

namespace AuthenticationJWT.Models;

public class Request
{
}

public class RefreshToken()
{
    [Required(ErrorMessage = "Email is required.")]
    public string refreshToken { get; set; }
    public string publicKey { get; set; }
}

public class UserRequest()
{
    [Required(ErrorMessage = "Password is required.")]
    public string Password { get; set; }

    [Required(ErrorMessage = "Email is required.")]
    public string Email { get; set; }

    [Required(ErrorMessage = "UserName is required.")]
    public string UserName { get; set; }

}

public class ResourceRequest()
{
    public string Name { get; set; }
    public string? Description { get; set; }
    public int Status { get; set; }
    public int Version { get; set; }

}