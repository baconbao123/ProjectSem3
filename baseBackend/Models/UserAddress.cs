using System.ComponentModel.DataAnnotations;

namespace AuthenticationJWT.Models;

public class UserAddress
{
    [Key]
    public int Id { get; set; }
    [Required]
    public int UserId { get; set; }

    public int Mark { get; set; }

    public string? Phone { get; set; }
    public bool Index { get; set; }
    public string? OtherMark { get; set; }
    public string DetailAdress { get; set; }
    public string? Address { get; set; }

    public int Version { get; set; }
    public int Status { get; set; }

    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdateAt { get; set; }
    public int CreatedBy { get; set; }
    public int UpdatedBy { get; set; }

    public DateTime? DeletedAt { get; set; }

    public UserAddress()
    {
        CreatedBy = 0;
        UpdatedBy = 0;
    }
}
