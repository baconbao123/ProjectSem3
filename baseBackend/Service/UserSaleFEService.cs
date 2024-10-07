using AuthenticationJWT.DTO;

namespace AuthenticationJWT.Service;

public interface UserSaleFEService
{
    public string AddSaleToUser(UserSaleDTO userSaleDTO);
}
