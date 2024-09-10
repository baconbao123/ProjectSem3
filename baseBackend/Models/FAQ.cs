using System.ComponentModel.DataAnnotations;

namespace AuthenticationJWT.Models;

public class FAQ
{
    [Key]
    public int Id { get; set; }
    [Required]
    public string Title { get; set; }
    public string Decription { get; set; }
    public int Type { get; set; }

    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdateAt { get; set; }
    public int CreatedBy { get; set; }
    public int UpdatedBy { get; set; }

    public DateTime? DeletedAt { get; set; }

    public FAQ()
    {
        CreatedBy = 0;
        UpdatedBy = 0;
    }
}
