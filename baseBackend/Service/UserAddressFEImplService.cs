using AuthenticationJWT.DTO;
using AuthenticationJWT.Models;
using AuthenticationJWT.Service;
using AutoMapper;

public class UserAddressFEImplService : UserAddressFEService
{
    private MyContext context;
    private IMapper mapper;

    public UserAddressFEImplService(MyContext context, IMapper mapper)
    {
        this.context = context;
        this.mapper = mapper;
    }

    private User getUserById(int id) => context.User.SingleOrDefault(u => u.Id == id);

    public List<UserAddress> getAddressByUser(int id)
    {
        var user = getUserById(id);
        if (user == null)
        {
            return new List<UserAddress>();
        }

        return context.UserAddress.Where(address => address.UserId == user.Id).ToList();
    }

    public bool PostAddress(AddressUserDTO addressUserDTO)
    {
        var user = getUserById(addressUserDTO.UserId);
        if (user == null)
        {
            return false;
        }
        var address = mapper.Map<UserAddress>(addressUserDTO);
        address.Status = 1;
        address.CreatedAt = DateTime.Now;
        address.UpdateAt = DateTime.Now;

        context.UserAddress.Add(address);
        return context.SaveChanges() > 0;
    }
}
