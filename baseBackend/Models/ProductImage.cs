using System.ComponentModel.DataAnnotations;

namespace AuthenticationJWT.Models;

public class ProductImage
{
    [Key]
    public int Id { get; set; }
    [Required]
    public string ProductId { get; set; }
    [Required]
    public string ImagePath { get; set; }

    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdateAt { get; set; }
    public int CreatedBy { get; set; }
    public int UpdatedBy { get; set; }

    public DateTime? DeletedAt { get; set; }

    public ProductImage()
    {
        CreatedBy = 0;
        UpdatedBy = 0;
    }
}
