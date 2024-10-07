using AuthenticationJWT.DTO;
using AuthenticationJWT.Models;

namespace AuthenticationJWT.Service;

public interface UserAddressFEService
{
    public bool PostAddress(AddressUserDTO addressUserDTO);
    public List<UserAddress> getAddressByUser(int id);
}
