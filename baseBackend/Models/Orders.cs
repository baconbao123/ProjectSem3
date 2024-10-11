using System.ComponentModel.DataAnnotations;

namespace AuthenticationJWT.Models;

public class Orders
{
    [Key]
    public int Id { get; set; }
    [Required]
    public int UserId { get; set; }
    [Required]
    public int AddressId { get; set; }
    public string Code { get; set; }
    public string BasePrice { get; set; }
    public string TotalPrice { get; set; }

    public int Status { get; set; }
    public int Version { get; set; }

    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdateAt { get; set; }
    public int CreatedBy { get; set; }
    public int UpdatedBy { get; set; }

    public DateTime? DeletedAt { get; set; }

    public Orders()
    {
        CreatedBy = 0;
        UpdatedBy = 0;
    }
}
