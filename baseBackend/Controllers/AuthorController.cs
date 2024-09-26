using AuthenticationJWT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AuthenticationJWT.Controllers;
[Route("api/[controller]")]
[ApiController]
public class AuthorController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private MyContext db;
    public AuthorController(IConfiguration configuration, MyContext myContext)
    {
        _configuration = configuration;
        db = myContext;
    }
    // GET: api/<AuthorController>
    [HttpGet]
    [Authorize]
    public IActionResult get()
    {
        var listData = (from item in db.Author
                        where item.DeletedAt == null
                        orderby item.CreatedAt descending
                        select item).ToList();

        return Ok(new { data = listData, total = listData.Count() });
    }

    // GET api/<AuthorController>/5
    [Authorize]
    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        var author = (from r in db.Author
                      join u in db.User on r.CreatedBy equals u.Id
                      join u2 in db.User on r.UpdatedBy equals u2.Id
                      where r.Id == id && r.DeletedAt == null
                      select new
                      {
                          Author = r,
                          UserCreate = u.Username,
                          UserUpdate = u2.Username,

                      }).FirstOrDefault();

        if (author == null)
        {
            return BadRequest(new { message = "Data not found" });
        }
        return Ok(new { data = author });
    }

    // POST api/<AuthorController>
    [HttpPost]
    [Authorize]
    public IActionResult Post([FromBody] AuthorRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;
        var author = new Author();
        author.Name = request.Name;
        author.Birth = request.DateOfBirth;
        author.Biography = request.Biography;
        author.Status = request.Status ?? 0;
        author.Version = 0;
        author.UpdateAt = DateTime.Now;
        author.CreatedAt = DateTime.Now;
        author.UpdatedBy = int.Parse(userId);
        author.CreatedBy = int.Parse(userId);
        db.Author.Add(author);
        db.SaveChanges();
        return Ok(new { data = author });
    }

    // PUT api/<AuthorController>/5
    [Authorize]
    [HttpPut("{id}")]
    public IActionResult Put(int id, [FromBody] AuthorRequest request)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;

        var author = db.Author.FirstOrDefault(c => c.Id == id && c.DeletedAt == null);
        if (author == null)
        {
            return BadRequest(new { message = "Data not found" });
        }
        if (author.Version != request.Version)
        {
            return BadRequest(new { type = "reload", message = "Data has change please reload" });
        }
        author.Name = request.Name;
        author.Birth = request.DateOfBirth;
        author.Biography = request.Biography;
        author.Status = request.Status ?? 0;
        author.Version = request.Version + 1;
        author.UpdateAt = DateTime.Now;
        author.UpdatedBy = int.Parse(userId);
        db.SaveChanges();
        return Ok(new { data = author });
    }

    // DELETE api/<AuthorController>/5'
    [Authorize]
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;
        var author = db.Author.FirstOrDefault(c => c.Id == id && c.DeletedAt == null);
        if (author == null)
        {
            return BadRequest(new { message = "Data not found" });
        }
        author.DeletedAt = DateTime.Now;
        author.UpdatedBy = int.Parse(userId);
        db.SaveChanges();
        return Ok(new { data = author });

    }
}
