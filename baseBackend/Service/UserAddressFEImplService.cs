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

        if (addressUserDTO.Index == true)
        {
            var otherAddresses = context.UserAddress
                .Where(a => a.UserId == user.Id)
                .ToList();


            foreach (var existingAddress in otherAddresses)
            {
                existingAddress.Index = false;
            }

        }
        var address = mapper.Map<UserAddress>(addressUserDTO);
        address.Status = 1;
        address.CreatedAt = DateTime.Now;
        address.UpdateAt = DateTime.Now;

        context.UserAddress.Add(address);
        return context.SaveChanges() > 0;
    }

    public bool UpdateUserAddress(AddressUserDTO addressUserDTO)
    {
        var user = getUserById(addressUserDTO.UserId);
        if (user == null)
        {
            return false;
        }

        var currentAddress = context.UserAddress.SingleOrDefault(a => a.UserId == user.Id && a.Id == addressUserDTO.Id);
        if (currentAddress == null)
        {
            return false;
        }

        if (addressUserDTO.Index.HasValue && addressUserDTO.Index.Value)
        {
            var otherAddresses = context.UserAddress
                .Where(a => a.UserId == user.Id && a.Id != currentAddress.Id)
                .ToList();

            foreach (var address in otherAddresses)
            {
                address.Index = false;
            }
        }

        if (!string.IsNullOrEmpty(addressUserDTO.AssignName))
        {
            currentAddress.AssignName = addressUserDTO.AssignName;
        }
        if (addressUserDTO.Assign.HasValue)
        {
            currentAddress.Assign = addressUserDTO.Assign.Value;
        }
        if (!string.IsNullOrEmpty(addressUserDTO.Phone))
        {
            currentAddress.Phone = addressUserDTO.Phone;
        }
        if (addressUserDTO.Index.HasValue)
        {
            currentAddress.Index = addressUserDTO.Index.Value;
        }
        if (!string.IsNullOrEmpty(addressUserDTO.Address))
        {
            currentAddress.Address = addressUserDTO.Address;
        }
        if (!string.IsNullOrEmpty(addressUserDTO.DetailAddress))
        {
            currentAddress.DetailAddress = addressUserDTO.DetailAddress;
        }

        currentAddress.UpdateAt = DateTime.Now;

        return context.SaveChanges() > 0;
    }


}
