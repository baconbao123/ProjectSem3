using AuthenticationJWT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AuthenticationJWT.Controllers;
[Route("api/[controller]")]
[ApiController]
public class RoleController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private MyContext db;
    public RoleController(IConfiguration configuration, MyContext myContext)
    {
        _configuration = configuration;
        db = myContext;
    }
    // GET: api/<ResourceController>
    [HttpGet]
    [Authorize]
    public IActionResult get()
    {
        var listData = (from item in db.Role
                        where item.DeletedAt == null
                        orderby item.CreatedAt descending
                        select item).ToList();

        return Ok(new { data = listData, total = listData.Count() });
    }

    // GET api/<ResourceController>/5
    [Authorize]
    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        var role = (from r in db.Role
                    join u in db.User on r.CreatedBy equals u.Id
                    where r.Id == id && r.DeletedAt == null
                    select new
                    {
                        Resource = r,
                        User = u
                    }).FirstOrDefault();

        if (role == null)
        {
            return BadRequest(new { message = "Data not found" });
        }
        return Ok(new { data = role });
    }

    // POST api/<ResourceController>
    [HttpPost]
    [Authorize]
    public IActionResult Post([FromBody] RoleRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;
        var role = new Role();
        role.Name = request.Name;
        role.Description = request.Description;
        role.Status = request.Status ?? 0;
        role.Version = 0;
        role.UpdateAt = DateTime.Now;
        role.CreatedAt = DateTime.Now;
        role.UpdatedBy = int.Parse(userId);
        role.CreatedBy = int.Parse(userId);
        db.Role.Add(role);
        db.SaveChanges();
        return Ok(new { data = role });
    }

    // PUT api/<ResourceController>/5
    [Authorize]
    [HttpPut("{id}")]
    public IActionResult Put(int id, [FromBody] RoleRequest request)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;

        var role = db.Role.FirstOrDefault(c => c.Id == id && c.DeletedAt == null);
        if (role == null)
        {
            return BadRequest(new { message = "Data not found" });
        }
        if (role.Version != request.Version)
        {
            return BadRequest(new { type = "reload", message = "Data has change pls reload" });
        }
        role.Name = request.Name;
        role.Description = request.Description;
        role.Status = request.Status ?? 0;
        role.Version = request.Version + 1;
        role.UpdateAt = DateTime.Now;
        role.UpdatedBy = int.Parse(userId);
        db.SaveChanges();
        return Ok(new { data = role });
    }

    // DELETE api/<ResourceController>/5'
    [Authorize]
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;
        var role = db.Role.FirstOrDefault(c => c.Id == id && c.DeletedAt == null);
        if (role == null)
        {
            return BadRequest(new { message = "Data not found" });
        }
        role.DeletedAt = DateTime.Now;
        role.UpdatedBy = int.Parse(userId);
        db.SaveChanges();
        return Ok(new { data = role });

    }
}
