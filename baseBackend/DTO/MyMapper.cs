using AuthenticationJWT.Models;
using AutoMapper;

namespace AuthenticationJWT.DTO;

public class MyMapper : Profile
{
    public MyMapper()
    {
        CreateMap<User, UserRegisterDTO>().ReverseMap();
        CreateMap<User, UserUpdateDTO>().ReverseMap();
        CreateMap<FAQ, FAQDTO>().ReverseMap();
    }
}
