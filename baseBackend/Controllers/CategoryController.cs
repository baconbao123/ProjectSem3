using AuthenticationJWT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AuthenticationJWT.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CategoryController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private MyContext db;
    public CategoryController(IConfiguration configuration, MyContext myContext)
    {
        _configuration = configuration;
        db = myContext;
    }
    // GET: api/<CategoryController>
    [HttpGet]
    [Authorize]
    public IActionResult get()
    {
        var listData = (from item in db.Category
                        where item.DeletedAt == null
                        orderby item.CreatedAt descending
                        select item).ToList();

        return Ok(new { data = listData, total = listData.Count() });
    }

    // GET api/<CategoryController>/5
    [Authorize]
    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        var category = (from r in db.Category
                        join u in db.User on r.CreatedBy equals u.Id
                        where r.Id == id && r.DeletedAt == null
                        select new
                        {
                            Category = r,
                            User = u
                        }).FirstOrDefault();

        if (category == null)
        {
            return BadRequest(new { message = "Data not found" });
        }
        return Ok(new { data = category });
    }

    // POST api/<CategoryController>
    [HttpPost]
    [Authorize]
    public IActionResult Post([FromBody] CategoryRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        string categoryCode = GenerateCategoryCode(request.Name);

        var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;
        var category = new Category();
        category.Name = request.Name;
        category.CategoryCode = categoryCode;
        category.Description = request.Description;
        category.ParentId = request.ParentId;
        category.Status = request.Status ?? 0;
        category.Version = 0;
        category.UpdateAt = DateTime.Now;
        category.CreatedAt = DateTime.Now;
        category.UpdatedBy = int.Parse(userId);
        category.CreatedBy = int.Parse(userId);
        db.Category.Add(category);
        db.SaveChanges();
        return Ok(new { data = category });
    }
    //GenerateCategoryCode 
    private string GenerateCategoryCode(string name)
    {

        string initialChar = name.Substring(0, 1).ToUpper();


        int number = 1;


        string categoryCode = initialChar + number;


        while (db.Category.Any(c => c.CategoryCode == categoryCode))
        {
            number++;
            categoryCode = initialChar + number;
        }

        return categoryCode;
    }

    // PUT api/<CategoryController>/5
    [Authorize]
    [HttpPut("{id}")]
    public IActionResult Put(int id, [FromBody] CategoryRequest request)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;

        var category = db.Category.FirstOrDefault(c => c.Id == id && c.DeletedAt == null);
        if (category == null)
        {
            return BadRequest(new { message = "Data not found" });
        }
        //if (category.Version != request.Version)
        //{
        //    return BadRequest(new { type = "reload", message = "Data has change pls reload" });
        //}
        category.Name = request.Name;
        category.Description = request.Description;
        category.Status = request.Status ?? 0;
        category.Version = category.Version + 1;
        category.UpdateAt = DateTime.Now;
        category.UpdatedBy = int.Parse(userId);
        db.SaveChanges();
        return Ok(new { data = category });
    }

    // DELETE api/<CategoryController>/5'
    [Authorize]
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;
        var category = db.Category.FirstOrDefault(c => c.Id == id && c.DeletedAt == null);
        if (category == null)
        {
            return BadRequest(new { message = "Data not found" });
        }
        category.DeletedAt = DateTime.Now;
        category.UpdatedBy = int.Parse(userId);
        db.SaveChanges();
        return Ok(new { data = category });

    }
}
