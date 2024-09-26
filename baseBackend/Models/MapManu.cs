using System.ComponentModel.DataAnnotations;

namespace AuthenticationJWT.Models;


public class MapManu
{
    [Key]
    public int Id { get; set; }
    [Required]
    public int ManuId { get; set; }

    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdateAt { get; set; }
    public int CreatedBy { get; set; }
    public int UpdatedBy { get; set; }

    public DateTime? DeletedAt { get; set; }

    public MapManu()
    {
        CreatedBy = 0;
        UpdatedBy = 0;
    }

}
