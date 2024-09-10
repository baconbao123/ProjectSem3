using System.ComponentModel.DataAnnotations;

namespace AuthenticationJWT.Models;

public class Delivery
{
    [Key]
    public int Id { get; set; }
    [Required]
    public int OderId { get; set; }

    [Required]
    public int AdressId { get; set; }

    [Required]
    public int UserAssign { get; set; }

    public float Distance { get; set; }
    public string DeliveryPrice { get; set; }
    public string CancelPrice { get; set; }
    public DateTime? ScheduleDate { get; set; }

    public int Version { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdateAt { get; set; }
    public int CreatedBy { get; set; }
    public int UpdatedBy { get; set; }

    public DateTime? DeletedAt { get; set; }

    public Delivery()
    {
        CreatedBy = 0;
        UpdatedBy = 0;
    }
}
