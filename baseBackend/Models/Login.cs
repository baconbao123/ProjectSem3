using System.ComponentModel.DataAnnotations;

namespace AuthenticationJWT.Models;

public class Login
{

    [Required(ErrorMessage = "Email is required.")]
    [StringLength(100, ErrorMessage = "Email must be less than 100 characters.")]
    public string Email { get; set; }
    [Required(ErrorMessage = "Password is required.")]
    //[StringLength(100, MinimumLength = 2, ErrorMessage = "Password must be between 6 and 100 characters.")]
    public string Password { get; set; }
    public bool Remember { get; set; }
}