using System.ComponentModel.DataAnnotations;

namespace AuthenticationJWT.Models;

public class ProductSale
{
    [Key]
    public int Id { get; set; }
    [Required]
    public int ProductId { get; set; }
    [Required]

    public int SaleId { get; set; }

    public int Version { get; set; }
    public int Status { get; set; }


    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdateAt { get; set; }
    public int CreatedBy { get; set; }
    public int UpdatedBy { get; set; }

    public DateTime? DeletedAt { get; set; }

    public ProductSale()
    {
        CreatedBy = 0;
        UpdatedBy = 0;
    }
}
