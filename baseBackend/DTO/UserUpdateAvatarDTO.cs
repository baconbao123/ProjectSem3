using System.ComponentModel.DataAnnotations;

namespace AuthenticationJWT.DTO;

public class UserUpdateAvatarDTO
{
    [Required]
    public int Id { get; set; }
    public IFormFile Avatar { get; set; }

}
