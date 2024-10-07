using AuthenticationJWT.DTO;
using AuthenticationJWT.Models;

namespace AuthenticationJWT.Service;

public class UserSaleFEServiceImpl : UserSaleFEService
{
    private MyContext context;

    public UserSaleFEServiceImpl(MyContext context)
    {
        this.context = context;
    }

    private UserSale CheckUserIdWithSale(int userId, int saleId)
    {
        return context.UserSale.FirstOrDefault(us => us.UserId == userId && us.SaleId == saleId);
    }

    public string AddSaleToUser(UserSaleDTO userSaleDTO)
    {
        var exsitingUserSale = CheckUserIdWithSale(userSaleDTO.UserId, userSaleDTO.SaleId);
        if (exsitingUserSale != null) throw new Exception("Sale already claimed by the user");

        var userSale = new UserSale()
        {
            UserId = userSaleDTO.UserId,
            SaleId = userSaleDTO.SaleId,
            Used = false,
            CreatedAt = DateTime.UtcNow,
            UpdateAt = DateTime.UtcNow
        };

        context.UserSale.Add(userSale);
        context.SaveChanges();

        return "CLAIMED";
    }
}
