using System.ComponentModel.DataAnnotations;

namespace AuthenticationJWT.Models;

public class Request
{
}

public class RefreshToken()
{
    [Required(ErrorMessage = "Email is required.")]
    public string refreshToken { get; set; }
    public string publicKey { get; set; }
}

public class UserRequest()
{
    [Required(ErrorMessage = "Password is required.")]
    public string Password { get; set; }

    [Required(ErrorMessage = "Email is required.")]
    public string Email { get; set; }

    [Required(ErrorMessage = "UserName is required.")]
    public string UserName { get; set; }

}

public class ResourceRequest()
{
    [Required(ErrorMessage = "Name is required.")]
    [StringLength(50, ErrorMessage = "Name cannot be longer than 50 characters.")]
    public string Name { get; set; }
    [StringLength(200, ErrorMessage = "Description cannot be longer than 200 characters.")]
    public string? Description { get; set; }
    [Required(ErrorMessage = "Status is required.")]
    [Range(0, 1, ErrorMessage = "Status must be either 0 or 1.")]
    public int? Status { get; set; }
    public int Version { get; set; }

}

public class RoleRequest()
{
    [Required(ErrorMessage = "Name is required.")]
    [StringLength(50, ErrorMessage = "Name cannot be longer than 50 characters.")]
    public string Name { get; set; }
    [StringLength(200, ErrorMessage = "Description cannot be longer than 200 characters.")]
    public string? Description { get; set; }
    [Required(ErrorMessage = "Status is required.")]
    [Range(0, 1, ErrorMessage = "Status must be either 0 or 1.")]
    public int? Status { get; set; }
    public int Version { get; set; }

}
public class PermisionForm()
{
    [Required(ErrorMessage = "Role_id is required.")]
    public int? role_id { get; set; }


    [Required(ErrorMessage = "Resource_id is required.")]
    public int? resource_id { get; set; }

    [Required(ErrorMessage = "Action_id is required.")]
    public int? action_id { get; set; }


}

public class CategoryRequest()
{
    [Required(ErrorMessage = "Name is required.")]
    [StringLength(50, ErrorMessage = "Name cannot be longer than 50 characters.")]
    public string Name { get; set; }
    [StringLength(200, ErrorMessage = "Description cannot be longer than 200 characters.")]
    public string? Description { get; set; }

    public int? ParentId { get; set; }
    [Required(ErrorMessage = "Status is required.")]
    [Range(0, 1, ErrorMessage = "Status must be either 0 or 1.")]
    public int? Status { get; set; }
    public int Version { get; set; }

}

public class AuthorRequest()
{
    [Required(ErrorMessage = "Name is required.")]
    [StringLength(60, ErrorMessage = "Name cannot be longer than 60 characters.")]
    public string Name { get; set; }
    public string? Biography { get; set; }

    [DataType(DataType.Date, ErrorMessage = "Invalid date format.")]
    [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:yyyy-MM-dd}")]
    public DateTime? DateOfBirth { get; set; }

    [Required(ErrorMessage = "Status is required.")]
    [Range(0, 1, ErrorMessage = "Status must be either 0 or 1.")]
    public int? Status { get; set; }
    public int Version { get; set; }


}

public class ProductRequest()
{

}