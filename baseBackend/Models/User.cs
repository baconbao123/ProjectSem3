using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace AuthenticationJWT.Models;

[Index(nameof(Email), IsUnique = true)]
public class User
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Username { get; set; }

    [Required]
    public string Password { get; set; }

    [Required]
    public string Email { get; set; }

    public string? RefreshToken { get; set; }
    public DateTime? Expired { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdateAt { get; set; }
    public int CreatedBy { get; set; }
    public int UpdatedBy { get; set; }

    public DateTime? DeletedAt { get; set; }



    public List<string>? Roles { get; set; } = new List<string>();

    public User()
    {
        CreatedBy = 0;
        UpdatedBy = 0;
    }
}