using System.ComponentModel.DataAnnotations;

namespace AuthenticationJWT.Models;

public class OrderProduct
{
    [Key]
    public int Id { get; set; }
    [Required]
    public int OderId { get; set; }
    [Required]
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public float Profit { get; set; }
    public string BasePrice { get; set; }
    public string ProductPrice { get; set; }

    public int Version { get; set; }

    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdateAt { get; set; }
    public int CreatedBy { get; set; }
    public int UpdatedBy { get; set; }

    public DateTime? DeletedAt { get; set; }

    public OrderProduct()
    {
        CreatedBy = 0;
        UpdatedBy = 0;
    }
}
