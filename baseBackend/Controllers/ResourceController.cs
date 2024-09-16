//using AuthenticationJWT.Models;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;

//// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

//namespace AuthenticationJWT.Controllers;
//[Route("api/[controller]")]
//[ApiController]
//public class ResourceController : ControllerBase
//{
//    private readonly IConfiguration _configuration;
//    private MyContext db;
//    public ResourceController(IConfiguration configuration, MyContext myContext)
//    {
//        _configuration = configuration;
//        db = myContext;
//    }
//    // GET: api/<ResourceController>
//    [HttpGet]
//    public IActionResult get()
//    {
//        var listData = (from item in db.Resource
//                        where item.DeletedAt == null
//                        select item).ToList();

//        return Ok(new { data = listData, total = listData.Count() });
//    }

//    // GET api/<ResourceController>/5
//    [HttpGet("{id}")]
//    public string Get(int id)
//    {
//        return "value";
//    }

//    // POST api/<ResourceController>
//    [HttpPost]
//    [Authorize]
//    public IActionResult Post([FromBody] ResourceRequest request)
//    {
//        var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;
//        var resource = new Resource();
//        resource.Name = request.Name;
//        resource.Description = request.Description;
//        resource.Status = request.Status;
//        resource.Version = 0;
//        resource.UpdateAt = DateTime.Now;
//        resource.CreatedAt = DateTime.Now;
//        resource.UpdatedBy = int.Parse(userId);
//        resource.CreatedBy = int.Parse(userId);
//        db.Resource.Add(resource);
//        db.SaveChanges();
//        return Ok(new { data = resource });
//    }

//    // PUT api/<ResourceController>/5
//    [Authorize]
//    [HttpPut("{id}")]
//    public IActionResult Put(int id, [FromBody] ResourceRequest request)
//    {
//        var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;

//        var resource = db.Resource.FirstOrDefault(c => c.Id == id && c.DeletedAt == null);
//        if (resource == null)
//        {
//            return BadRequest(new { message = "Data not found" });
//        }
//        resource.Name = request.Name;
//        resource.Description = request.Description;
//        resource.Status = request.Status;
//        resource.Version = request.Version + 1;
//        resource.UpdateAt = DateTime.Now;
//        resource.UpdatedBy = int.Parse(userId);
//        db.SaveChanges();
//        return Ok(new { data = resource });
//    }

//    // DELETE api/<ResourceController>/5
//    [HttpDelete("{id}")]
//    public IActionResult Delete(int id)
//    {
//        var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;
//        var resource = db.Resource.FirstOrDefault(c => c.Id == id && c.DeletedAt == null);
//        if (resource == null)
//        {
//            return BadRequest(new { message = "Data not found" });
//        }
//        resource.DeletedAt = DateTime.Now;
//        resource.UpdatedBy = int.Parse(userId);
//        db.SaveChanges();
//        return Ok(new { data = resource });

//    }
//}
