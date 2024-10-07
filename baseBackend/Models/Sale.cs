using System.ComponentModel.DataAnnotations;

namespace AuthenticationJWT.Models;

public class Sale
{
    [Key]
    public int Id { get; set; }
    [Required]
    public string Name { get; set; }
    public float Discount { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int Type { get; set; }

    public int Version { get; set; }

    public int Status { get; set; }
    public int Quantity { get; set; }
    public int CategoryId { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdateAt { get; set; }
    public int CreatedBy { get; set; }
    public int UpdatedBy { get; set; }

    public DateTime? DeletedAt { get; set; }

    public Sale()
    {
        CreatedBy = 0;
        UpdatedBy = 0;
    }
}
