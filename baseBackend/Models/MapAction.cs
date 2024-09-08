using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace AuthenticationJWT.Models;

[Index(nameof(roleId), nameof(resourceId), nameof(actionId), IsUnique = true)]

public class MapAction
{
    [Key]
    public int id { get; set; }
    [Required]
    public int roleId { get; set; }
    [Required]
    public int resourceId { get; set; }

    [Required]
    public int actionId { get; set; }
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
