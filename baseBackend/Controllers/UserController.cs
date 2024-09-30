using AuthenticationJWT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Text.Json;

namespace AuthenticationJWT.Controllers;
[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{

    private MyContext db;

    public UserController(MyContext myContext)
    {
        db = myContext;

    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var data = (from user in db.User
                    join map in db.MapRole on user.Id equals map.UserId into userRoles
                    from map in userRoles.DefaultIfEmpty()
                    join role in db.Role on map.RoleId equals role.Id into roleGroups
                    from role in roleGroups.DefaultIfEmpty()
                    where user.DeletedAt == null && (role == null || role.DeletedAt == null) && (role == null || role.Status == 1) && (map == null || map.DeletedAt == null)
                    group role by new
                    {
                        user.Id,
                        user.Username,
                        user.Email,
                        user.Phone,
                        user.Status,
                        user.Version,
                        user.Avatar
                    } into groupedUsers
                    select new
                    {
                        Id = groupedUsers.Key.Id,
                        UserName = groupedUsers.Key.Username,
                        Email = groupedUsers.Key.Email,
                        Phone = groupedUsers.Key.Phone,
                        Status = groupedUsers.Key.Status,
                        Version = groupedUsers.Key.Version,
                        Avatar = groupedUsers.Key.Avatar,
                        Roles = groupedUsers
                                .Where(r => r != null)
                                .Select(r => new
                                {
                                    RoleId = r.Id,
                                    RoleName = r.Name
                                }).ToList()
                    }).ToList();

        return Ok(new { data = data });
    }

    [Authorize]
    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        var data = (from user in db.User
                    join map in db.MapRole on user.Id equals map.UserId into userRoles
                    from mapRole in userRoles.DefaultIfEmpty()
                    join role in db.Role on mapRole.RoleId equals role.Id into roleGroups
                    from role in roleGroups.DefaultIfEmpty()
                    where user.DeletedAt == null && user.Id == id && (role == null || role.DeletedAt == null) && (role == null || role.Status == 1) && (mapRole == null || mapRole.DeletedAt == null)
                    group role by new
                    {
                        user.Id,
                        user.Username,
                        user.Email,
                        user.Phone,
                        user.Status,
                        user.Version,
                        user.Avatar
                    } into groupedUsers
                    select new
                    {
                        Id = groupedUsers.Key.Id,
                        name = groupedUsers.Key.Username,
                        email = groupedUsers.Key.Email,
                        phone = groupedUsers.Key.Phone,
                        status = groupedUsers.Key.Status,
                        Version = groupedUsers.Key.Version,
                        Avatar = groupedUsers.Key.Avatar,
                        role = groupedUsers
                                .Where(r => r != null)
                                .Select(r => new
                                {
                                    code = r.Id,
                                    label = r.Name
                                }).ToList()
                    }).FirstOrDefault();

        if (data == null)
        {
            return BadRequest(new { message = "Data not found" });
        }
        return Ok(new { data = data });
    }


    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(UserRequest user)
    {
        List<string> validExtensions = new List<string> { ".jpg", ".png", ".gif" };
        string extension = Path.GetExtension(user.Avatar.FileName);
        if (!validExtensions.Contains(extension))
        {
            return BadRequest($"Phần mở rộng file không hợp lệ ({string.Join(",", validExtensions)})");
        }

        long maxSize = 20 * 1024 * 1024;
        if (user.Avatar.Length > maxSize)
        {
            return BadRequest("Kích thước file tối đa là 5MB");
        }
        var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;
        var password = BCrypt.Net.BCrypt.HashPassword(user.Password);
        var existEmail = db.User.FirstOrDefault(item => item.Email == user.Email);
        string fileName = Guid.NewGuid().ToString() + extension;
        string path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images", fileName);
        if (existEmail != null)
        {
            return BadRequest(new { Errors = new { Email = new string[] { "Email is already exist" } } });
        }
        try
        {
            using (FileStream stream = new FileStream(path, FileMode.Create))
            {
                await user.Avatar.CopyToAsync(stream);
            }
        }
        catch (Exception ex)
        {
            return BadRequest($"Lỗi trong quá trình tải lên: {ex.Message}");
        }
        List<int> roleItems = JsonSerializer.Deserialize<List<int>>(user.Role);
        var element = new User
        {
            Email = user.Email,
            Password = password,
            Username = user.UserName,
            Phone = user.Phone,
            Status = (user.Status ?? 0),
            Avatar = fileName
        };

        db.User.Add(element);
        db.SaveChanges();

        foreach (var item in roleItems)
        {
            db.MapRole.Add(new MapRole { RoleId = item, UserId = element.Id, UpdateAt = DateTime.Now, CreatedAt = DateTime.Now, CreatedBy = int.Parse(userId), UpdatedBy = int.Parse(userId) });
        }
        db.SaveChanges();

        return Ok(element);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, UserRequestUpdate request)
    {
        List<string> validExtensions = new List<string> { ".jpg", ".png", ".gif" };
        string extension = Path.GetExtension(request.Avatar.FileName);
        if (!validExtensions.Contains(extension))
        {
            return BadRequest($"Phần mở rộng file không hợp lệ ({string.Join(",", validExtensions)})");
        }

        long maxSize = 20 * 1024 * 1024;
        if (request.Avatar.Length > maxSize)
        {
            return BadRequest("Kích thước file tối đa là 5MB");
        }
        var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;
        List<int> roleItems = JsonSerializer.Deserialize<List<int>>(request.Role);
        var user = db.User.FirstOrDefault(c => c.Id == id && c.DeletedAt == null);
        if (user == null)
        {
            return BadRequest(new { message = "Data not found" });
        }
        if (user.Version != request.Version)
        {
            return BadRequest(new { type = "reload", message = "Data has change pls reload" });
        }
        string fileName = Guid.NewGuid().ToString() + extension;
        string path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images", fileName);
        try
        {
            using (FileStream stream = new FileStream(path, FileMode.Create))
            {
                await request.Avatar.CopyToAsync(stream);
            }
        }
        catch (Exception ex)
        {
            return BadRequest($"Lỗi trong quá trình tải lên: {ex.Message}");
        }
        user.Username = request.UserName;
        user.Email = request.Email;
        user.Phone = request.Phone;
        user.Status = request.Status ?? 0;
        user.Version = request.Version + 1;
        user.UpdateAt = DateTime.Now;
        user.UpdatedBy = int.Parse(userId);
        user.Avatar = fileName;
        db.SaveChanges();
        var listRole = (from map in db.MapRole where map.UserId == id select map).ToList();
        foreach (var role in listRole)
        {
            role.DeletedAt = DateTime.Now;
        }
        db.SaveChanges();
        foreach (var item in roleItems)
        {
            db.MapRole.Add(new MapRole { RoleId = item, UserId = user.Id, UpdateAt = DateTime.Now, CreatedAt = DateTime.Now, CreatedBy = int.Parse(userId), UpdatedBy = int.Parse(userId) });
        }
        db.SaveChanges();
        return Ok(new { data = user });
    }

    [Authorize]
    [HttpPut("changePass/{id}")]
    public IActionResult ChangePass(int id, [FromBody] PasswordRequest request)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;
        var user = db.User.FirstOrDefault(c => c.Id == id && c.DeletedAt == null);
        if (user == null)
        {
            return BadRequest(new { message = "Data not found" });
        }
        var password = BCrypt.Net.BCrypt.HashPassword(request.password);
        user.Password = password;
        user.RefreshToken = null;
        db.SaveChanges();
        return Ok(new { data = user });
    }

    [Authorize]
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var user = db.User.FirstOrDefault(c => c.Id == id && c.DeletedAt == null);
        if (user == null)
        {
            return BadRequest(new { message = "Data not found" });
        }
        user.DeletedAt = DateTime.Now;
        var listRole = (from map in db.MapRole where map.UserId == id select map).ToList();
        foreach (var role in listRole)
        {
            role.DeletedAt = DateTime.Now;
        }
        db.SaveChanges();
        return Ok(new { data = user });

    }


}
