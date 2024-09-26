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
    public IActionResult Get()
    {
        // Lấy tất cả các danh mục vào bộ nhớ.
        var categories = (from item in db.Category
                          where item.DeletedAt == null
                          orderby item.CreatedAt descending
                          select item).ToList();

        //// Tạo danh sách chứa kết quả.
        var listData = new List<object>();

        //// Tìm tất cả các danh mục gốc (ParentId = null).
        var rootCategories = categories.Where(c => c.ParentId == null).ToList();

        //// Xây dựng danh sách theo cấp bậc bắt đầu từ danh mục gốc.
        foreach (var rootCategory in rootCategories)
        {
            GetCategoryWithLevel(categories, rootCategory, 0, listData);
        }

        return Ok(new { data = listData, total = listData.Count() });
        //return Ok(new { data = listData, total = listData.Count });
    }

    // Phương thức đệ quy để xác định cấp bậc và thêm vào danh sách kết quả.
    private void GetCategoryWithLevel(List<Category> categories, Category currentCategory, int level, List<object> listData)
    {
        // Thêm danh mục hiện tại vào danh sách với cấp bậc.
        listData.Add(new
        {
            currentCategory.Id,
            currentCategory.Name,
            currentCategory.Description,
            currentCategory.CategoryCode,
            currentCategory.Status,
            currentCategory.CreatedAt,
            currentCategory.UpdateAt,
            ParentId = currentCategory.ParentId,
            Level = level  // Cấp bậc hiện tại của danh mục.
        });

        // Tìm các danh mục con của danh mục hiện tại.
        var subCategories = categories.Where(c => c.ParentId == currentCategory.Id).ToList();

        // Đệ quy cho từng danh mục con, tăng cấp bậc lên 1.
        foreach (var subCategory in subCategories)
        {
            GetCategoryWithLevel(categories, subCategory, level + 1, listData);
        }
    }


    // GET api/<CategoryController>/5
    [Authorize]
    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        var category = (from r in db.Category
                        join u in db.User on r.CreatedBy equals u.Id
                        join u2 in db.User on r.UpdatedBy equals u2.Id
                        where r.Id == id && r.DeletedAt == null
                        select new
                        {
                            Category = r,
                            UserCreate = u.Username,
                            UserUpdate = u2.Username,
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
        // check ParentId
        if (request.ParentId.HasValue)
        {
            var parentCategory = db.Category.FirstOrDefault(c => c.Id == request.ParentId);
            if (parentCategory == null)
            {
                return BadRequest(new { message = "Parent not found." });
            }
            if (parentCategory.Id == request.ParentId)
            {
                return BadRequest(new { message = "Parent must not coincide with itself " });
            }
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
        if (category.Id == request.ParentId)
        {
            return BadRequest(new { message = "Parent must not coincide with itself " });
        }
        if (category.Version != request.Version)
        {
            return BadRequest(new { type = "reload", message = "Data has change pls reload" });
        }
        string categoryCode = GenerateCategoryCode(request.Name);

        category.Name = request.Name;
        category.Description = request.Description;
        category.CategoryCode = categoryCode;
        category.ParentId = request.ParentId;
        category.Status = request.Status ?? 0;
        category.Version = request.Version + 1;
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
