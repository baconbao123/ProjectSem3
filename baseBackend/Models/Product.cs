using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace AuthenticationJWT.Models;

[Index(nameof(Code), IsUnique = true)]
public class Product
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Code { get; set; }
    [Required]
    public int CategoryId { get; set; }

    [Required]
    public int CompanyPartnerId { get; set; }

    [Required]
    public string Name { get; set; }

    public string Description { get; set; }


    public double? BasePrice { get; set; }

    public double? SellPrice { get; set; }

    public float? Profit { get; set; }

    public int Quantity { get; set; }

    public int Version { get; set; }
    public int Status { get; set; }

    public DateTime? Expired { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdateAt { get; set; }
    public int CreatedBy { get; set; }
    public int UpdatedBy { get; set; }

    public DateTime? DeletedAt { get; set; }
    public Product()
    {
        CreatedBy = 0;
        UpdatedBy = 0;
    }
}
