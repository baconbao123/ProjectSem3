using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
namespace AuthenticationJWT.Models;

[Index(nameof(RoleId), nameof(UserId), IsUnique = true)]

public class MapRole
{
    [Key]
    public int Id { get; set; }
    [Required]
    public int RoleId { get; set; }

    [Required]
    public int UserId { get; set; }

    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdateAt { get; set; }
    public int CreatedBy { get; set; }
    public int UpdatedBy { get; set; }

    public DateTime? DeletedAt { get; set; }

    public MapRole()
    {
        CreatedBy = 0;
        UpdatedBy = 0;
    }
}
