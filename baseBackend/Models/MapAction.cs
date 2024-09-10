using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace AuthenticationJWT.Models;

[Index(nameof(RoleId), nameof(ResourceId), nameof(ActionId), IsUnique = true)]

public class MapAction
{
    [Key]
    public int Id { get; set; }
    [Required]
    public int RoleId { get; set; }
    [Required]
    public int ResourceId { get; set; }

    [Required]
    public int ActionId { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdateAt { get; set; }
    public int CreatedBy { get; set; }
    public int UpdatedBy { get; set; }

    public DateTime? DeletedAt { get; set; }

    public MapAction()
    {
        CreatedBy = 0;
        UpdatedBy = 0;
    }

}
