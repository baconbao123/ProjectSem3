using AuthenticationJWT.DTO;
using AuthenticationJWT.Models;

namespace AuthenticationJWT.Service;

public interface UserFEService
{
    public bool PostRegisterUser(UserRegisterDTO userDto);
    public bool UpdateUser(UserUpdateDTO userDto);
    public User getUserByID(int id);
    public List<User> getAllUser();
}
