using AuthenticationJWT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AuthenticationJWT.Controllers;
[Route("api/[controller]")]
[ApiController]
public class PermissionController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private MyContext db;
    public PermissionController(IConfiguration configuration, MyContext myContext)
    {
        _configuration = configuration;
        db = myContext;
    }
    // GET: api/<ResourceController>
    [HttpGet]
    [Authorize]
    public IActionResult get()
    {
        var listData = (from item in db.Resource
                        where item.DeletedAt == null
                        orderby item.CreatedAt descending
                        select item).ToList();

        return Ok(new { data = listData, total = listData.Count() });
    }

    // GET api/<ResourceController>/5
    //[Authorize]
    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        var data = (from role in db.Role
                    join map in db.MapAction on role.Id equals map.RoleId
                    join resource in db.Resource on map.ResourceId equals resource.Id
                    where role.Id == id && role.DeletedAt == null && map.DeletedAt == null && role.DeletedAt == null
                    select new
                    {
                        role_id = role.Id,
                        resource_id = resource.Id,
                        action_id = map.ActionId
                    }).ToList();

        if (data == null)
        {
            return BadRequest(new { message = "Data not found" });
        }
        return Ok(new { data = data });
    }

    // POST api/<ResourceController>
    [HttpPost]
    //[Authorize]
    public IActionResult Post([FromBody] List<PermisionForm> request)
    {
        var mapAction = (from map in db.MapAction where map.DeletedAt == null select map).ToList();
        foreach (var map in mapAction)
        {
            map.DeletedAt = DateTime.Now;
        }
        db.SaveChanges();
        foreach (var item in request)
        {
            db.MapAction.Add(new MapAction { ResourceId = (item.resource_id ?? 0), ActionId = (item.action_id ?? 0), RoleId = (item.role_id ?? 0) });
        }
        db.SaveChanges();
        return Ok(new { data = request });
    }

    // PUT api/<ResourceController>/5
    [Authorize]
    [HttpPut("{id}")]
    public IActionResult Put(int id, [FromBody] List<PermisionForm> request)
    {
        var mapAction = (from map in db.MapAction where map.DeletedAt == null && map.RoleId == id select map).ToList();
        foreach (var map in mapAction)
        {
            map.DeletedAt = DateTime.Now;
        }
        db.SaveChanges();
        foreach (var item in request)
        {
            db.MapAction.Add(new MapAction { ResourceId = (item.resource_id ?? 0), ActionId = (item.action_id ?? 0), RoleId = (item.role_id ?? 0) });
        }
        db.SaveChanges();
        return Ok(new { data = request });
    }

    // DELETE api/<ResourceController>/5'
    [Authorize]
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;
        var resource = db.Resource.FirstOrDefault(c => c.Id == id && c.DeletedAt == null);
        if (resource == null)
        {
            return BadRequest(new { message = "Data not found" });
        }
        resource.DeletedAt = DateTime.Now;
        resource.UpdatedBy = int.Parse(userId);
        db.SaveChanges();
        return Ok(new { data = resource });

    }
}
