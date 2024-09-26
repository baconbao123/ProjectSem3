using System.ComponentModel.DataAnnotations;

namespace AuthenticationJWT.Models;


public class MapPublish
{
    [Key]
    public int Id { get; set; }
    [Required]
    public int PublishId { get; set; }

    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdateAt { get; set; }
    public int CreatedBy { get; set; }
    public int UpdatedBy { get; set; }

    public DateTime? DeletedAt { get; set; }

    public MapPublish()
    {
        CreatedBy = 0;
        UpdatedBy = 0;
    }

}
