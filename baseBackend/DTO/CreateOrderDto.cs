namespace AuthenticationJWT.DTO;

public class CreateOrderDto
{
    public int UserId { get; set; }
    public int AddressId { get; set; }
    public string TotalPrice { get; set; }
    public List<OrderProductDto> Products { get; set; }
}

public class OrderProductDto
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public float BasePrice { get; set; }
    public float SellPrice { get; set; }

}


