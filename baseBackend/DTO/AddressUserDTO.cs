namespace AuthenticationJWT.DTO;

public class AddressUserDTO
{
    public int? Id { get; set; }
    public int UserId { get; set; }
    public string? AssignName { get; set; }
    public bool? Assign { get; set; }
    public string? Phone { get; set; }
    public bool? Index { get; set; }
    public string? Address { get; set; }
    public string? DetailAddress { get; set; }
}
