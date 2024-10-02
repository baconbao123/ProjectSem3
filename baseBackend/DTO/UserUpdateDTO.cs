using System.ComponentModel.DataAnnotations;

namespace AuthenticationJWT.DTO;

public class UserUpdateDTO
{
    [Required]
    public int Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string Phone { get; set; }
    public IFormFile Avatar { get; set; }
}
