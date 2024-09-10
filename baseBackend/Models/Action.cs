using System.ComponentModel.DataAnnotations;

namespace AuthenticationJWT.Models;

public class Action
{
    [Key]
    public int Id { get; set; }
    [Required]
    public string Name { get; set; }
    public string? Description { get; set; }
    public int Version { get; set; }

    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdateAt { get; set; }
    public int CreatedBy { get; set; }
    public int UpdatedBy { get; set; }

    public DateTime? DeletedAt { get; set; }

    public Action()
    {
        CreatedBy = 0;
        UpdatedBy = 0;
    }
}
