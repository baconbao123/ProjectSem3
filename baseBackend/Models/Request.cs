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

    [Required(ErrorMessage = "Phone is required.")]
    public string Phone { get; set; }

    [Required(ErrorMessage = "Role is required.")]
    public string Role { get; set; }

    [Required(ErrorMessage = "Status is required.")]
    [Range(0, 1, ErrorMessage = "Status must be either 0 or 1.")]
    public int? Status { get; set; }
    public IFormFile Avatar { get; set; }

}
public class UserRequestUpdate()
{
    [Required(ErrorMessage = "Email is required.")]
    public string Email { get; set; }

    [Required(ErrorMessage = "UserName is required.")]
    public string UserName { get; set; }

    [Required(ErrorMessage = "Phone is required.")]
    public string Phone { get; set; }

    [Required(ErrorMessage = "Role is required.")]
    public string Role { get; set; }

    [Required(ErrorMessage = "Status is required.")]
    [Range(0, 1, ErrorMessage = "Status must be either 0 or 1.")]
    public int? Status { get; set; }
    public int Version { get; set; }
    public IFormFile? Avatar { get; set; }

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
    //[Required(ErrorMessage = "Name is required.")]
    //[StringLength(50, ErrorMessage = "Name cannot be longer than 50 characters.")]
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
    [StringLength(500, ErrorMessage = "Biography  cannot be longer than 500 characters.")]
    public string? Biography { get; set; }

    [DataType(DataType.Date, ErrorMessage = "Invalid date format.")]
    [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:yyyy-MM-dd}")]
    public DateTime? DateOfBirth { get; set; }

    [Required(ErrorMessage = "Status is required.")]
    [Range(0, 1, ErrorMessage = "Status must be either 0 or 1.")]
    public int? Status { get; set; }
    public int Version { get; set; }

}
public class PasswordRequest()
{
    [Required(ErrorMessage = "Pasword is required.")]
    [StringLength(60, ErrorMessage = "Pasword cannot be longer than 60 characters.")]
    public string password { get; set; }
}


public class CompanyPartnerRequest()
{
    [Required(ErrorMessage = "Name is required.")]
    [StringLength(50, ErrorMessage = "Name cannot be longer than 50 characters.")]
    public string Name { get; set; }

    [StringLength(200, ErrorMessage = "Address cannot be longer than 200 characters.")]
    public string? Address { get; set; }

    [StringLength(15, ErrorMessage = "Phone cannot be longer than 15 characters.")]
    public string? Phone { get; set; }

    [EmailAddress(ErrorMessage = "Invalid email format.")]
    public string? Email { get; set; }
    [Required(ErrorMessage = "Type is required.")]
    public string Type { get; set; }

    [Required(ErrorMessage = "Status is required.")]
    [Range(0, 1, ErrorMessage = "Status must be either 0 or 1.")]
    public int? Status { get; set; }

    public int Version { get; set; }

}


public class ProductRequest
{
    [Required(ErrorMessage = "Name is required.")]
    [StringLength(100, ErrorMessage = "Name cannot be longer than 100 characters.")]
    public string Name { get; set; }

    public string? Description { get; set; }

    [Required(ErrorMessage = "BasePrice is required.")]
    [Range(0, double.MaxValue, ErrorMessage = "BasePrice must be a positive number.")]
    public double BasePrice { get; set; }

    [Required(ErrorMessage = "SellPrice is required.")]
    [Range(0, double.MaxValue, ErrorMessage = "SellPrice must be a positive number.")]
    public double SellPrice { get; set; }

    [Required(ErrorMessage = "Quantity is required.")]
    [Range(0, int.MaxValue, ErrorMessage = "Quantity must be a positive number.")]
    public int Quantity { get; set; }

    [Required(ErrorMessage = "CompanyPartnerId is required.")]
    public int CompanyPartnerId { get; set; }

    [Required(ErrorMessage = "Status is required.")]
    [Range(0, 1, ErrorMessage = "Status must be either 0 or 1.")]
    public int? Status { get; set; }

    [Required(ErrorMessage = "Version is required.")]
    public int Version { get; set; }

    [Required(ErrorMessage = "Thumbnail image is required.")]
    public IFormFile ImageThumbPath { get; set; }

    public List<IFormFile>? ProductImages { get; set; }

    public List<int>? AuthorIds { get; set; }

    [Required(ErrorMessage = "At least one category is required.")]
    public List<int> CategoryIds { get; set; }


    //public List<string>? DeletedImages { get; set; }
}


// Request class cho bảng ProductImage
public class ProductImageRequest()
{
    [Required(ErrorMessage = "ImagePath is required.")]
    [StringLength(200, ErrorMessage = "ImagePath cannot be longer than 200 characters.")]
    public string ImagePath { get; set; }


}



public class SaleRequest

{
    [Required(ErrorMessage = "Name is required.")]
    [StringLength(100, ErrorMessage = "Name cannot be longer than 100 characters.")]
    public string Name { get; set; }

    [Required(ErrorMessage = "Discount is required.")]
    public float Discount { get; set; }

    [Required(ErrorMessage = "Type is required.")]

    public int Type { get; set; }


    [DataType(DataType.Date, ErrorMessage = "Invalid date format.")]
    [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:yyyy-MM-dd}")]
    public DateTime? StartDate { get; set; }

    [DataType(DataType.Date, ErrorMessage = "Invalid date format.")]
    [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:yyyy-MM-dd}")]
    public DateTime? EndDate { get; set; }

    public int Quantity { get; set; }

    public int? CategoryId { get; set; }


    [Required(ErrorMessage = "Status is required.")]
    [Range(0, 1, ErrorMessage = "Status must be either 0 or 1.")]
    public int? Status { get; set; }

    public int Version { get; set; }
}

public class OrderRequest()
{
    [Required(ErrorMessage = "Action is required.")]
    [StringLength(50, ErrorMessage = "Action cannot be longer than 50 characters.")]
    public string action { get; set; }
    [Required(ErrorMessage = "Status is required.")]
    [Range(1, 4, ErrorMessage = "Status must be either 0 or 1.")]
    public int? Status { get; set; }
    public int Version { get; set; }

}

public class OrderCancel()
{
    [Required(ErrorMessage = "Cancel is required.")]
    public string Cancel { get; set; }
}