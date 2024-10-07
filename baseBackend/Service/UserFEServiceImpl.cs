using AuthenticationJWT.DTO;
using AuthenticationJWT.Helper;
using AuthenticationJWT.Models;
using AutoMapper;

namespace AuthenticationJWT.Service;

public class UserFEServiceImpl : UserFEService
{
    private MyContext db;
    private IMapper mapper;
    private IWebHostEnvironment webHostEnvironment;

    public UserFEServiceImpl(MyContext db, IMapper mapper, IWebHostEnvironment webHostEnvironment)
    {
        this.db = db;
        this.mapper = mapper;
        this.webHostEnvironment = webHostEnvironment;
    }

    public List<User> getAllUser()
    {
        return db.User.ToList();
    }

    public User getUserByID(int id)
    {
        return db.User.SingleOrDefault(u => u.Id == id);
    }

    public bool PostRegisterUser(UserRegisterDTO userDto)
    {
        try
        {
            var user = mapper.Map<User>(userDto);
            user.Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password);
            user.CreatedAt = DateTime.Now;
            user.UpdateAt = DateTime.Now;
            user.Status = 1;
            db.User.Add(user);
            return db.SaveChanges() > 0;
        }
        catch
        {
            return false;
        }
    }



    public bool UpdateUser(UserUpdateDTO userDto)
    {
        if (userDto != null)
        {
            var user = getUserByID(userDto.Id);

            if (user == null) return false;
            if (userDto.Avatar != null && userDto.Avatar.Length > 0)
            {
                string fileName = FileHelper.generateFileName(userDto.Avatar.FileName);
                string uploadsFolder = Path.Combine(webHostEnvironment.WebRootPath, "images");
                string filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    userDto.Avatar.CopyTo(stream);
                }

                user.Avatar = fileName;
            }

            user.Username = string.IsNullOrEmpty(userDto.Username) ? user.Username : userDto.Username;
            user.Email = string.IsNullOrEmpty(userDto.Email) ? user.Email : userDto.Email;
            user.Phone = string.IsNullOrEmpty(userDto.Phone) ? user.Phone : userDto.Phone;
            user.UpdateAt = DateTime.Now;


            if (!string.IsNullOrEmpty(userDto.Password))
            {
                user.Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password);
            }

            return db.SaveChanges() > 0;
        }
        else
        {
            return false;
        }
    }
}
