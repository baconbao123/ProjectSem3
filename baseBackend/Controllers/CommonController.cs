using AuthenticationJWT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AuthenticationJWT.Controllers;
[Route("api/[controller]")]
[ApiController]
public class CommonController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private MyContext db;
    public CommonController(IConfiguration configuration, MyContext myContext)
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
    [HttpGet("{resource}")]
    public IActionResult Get(string resource)
    {


        if (resource == "action")
        {
            var listData = (from item in db.Action
                            where item.DeletedAt == null
                            orderby item.CreatedAt descending
                            select item).ToList();
            return Ok(new { data = listData });
        }
        else if (resource == "resource")
        {
            var listData = (from item in db.Resource
                            where item.DeletedAt == null && item.Status == 1
                            orderby item.CreatedAt descending
                            select item).ToList();
            return Ok(new { data = listData });
        }
        else if (resource == "role")
        {
            var listData = (from item in db.Role
                            where item.DeletedAt == null && item.Status == 1
                            orderby item.CreatedAt descending
                            select new
                            {
                                label = item.Name,
                                code = item.Id,
                            }).ToList();
            return Ok(new { data = listData });
        }
        else if (resource == "author")
        {
            var listData = (from item in db.Author
                            where item.DeletedAt == null
                            orderby item.CreatedAt descending
                            select item).ToList();

            return Ok(new { data = listData, total = listData.Count() });
        }
        else if (resource == "category")
        {
            var categories = db.Category
                      .Where(c => c.DeletedAt == null).ToList();


            var listData = new List<object>();


            var rootCategories = categories.Where(c => c.ParentId == null).ToList();


            foreach (var rootCategory in rootCategories)
            {
                GetCategoryWithLevel(categories, rootCategory, 0, listData);
            }

            return Ok(new { data = listData, total = listData.Count() });
        }
        else if (resource == "companypartner")
        {
            var listData = (from item in db.CompanyPartner
                            where item.DeletedAt == null
                            orderby item.CreatedAt descending
                            select item).ToList();

            return Ok(new { data = listData, total = listData.Count() });
        }
        else if (resource == "product")
        {
            // Fetch product list with additional conditions for active categories
            var listData = (from item in db.Product
                            join partner in db.CompanyPartner on item.CompanyPartnerId equals partner.Id
                            where item.DeletedAt == null && item.Status == 1
                                  && !db.ProductCategory.Any(pc => pc.ProductId == item.Id
                                                                    && db.Category.Any(c => c.Id == pc.CategoryId && c.Status != 1))
                            orderby item.CreatedAt descending
                            select new
                            {
                                item.Id,
                                item.Code,
                                item.Name,
                                item.Description,
                                item.ImageThumbPath,
                                // Fetch company partner name
                                CompanyPartnerName = partner.Name,
                                item.Version,
                                item.Status,
                                item.BasePrice,
                                item.SellPrice,
                                item.Quantity,
                                item.CreatedAt,
                                item.UpdateAt,

                            }).ToList();

            return Ok(new { data = listData, total = listData.Count });

        }
        else if (resource == "dashboard")
        {
            var listData = (from item in db.CompanyPartner
                            where item.DeletedAt == null
                            orderby item.CreatedAt descending
                            select item).ToList();

            return Ok(new { data = listData, total = listData.Count() });
        }
        return BadRequest(new { message = "Data not found" });



    }
    [HttpGet("{resource}/category")]
    public IActionResult GetCategory(string resource, int categoryId)
    {
        if (resource != "product")
        {
            return BadRequest(new { message = "Invalid resource type" });
        }

        var category = db.Category.FirstOrDefault(c => c.Id == categoryId && c.Status == 1);
        if (category == null)
        {
            return NotFound(new { message = "Category not found or not active." });
        }

        // Determine if the category is a parent category
        bool isParentCategory = db.Category.Any(c => c.ParentId == categoryId);

        // Get list of category IDs to search
        var categoryIdsToSearch = isParentCategory
            ? db.Category.Where(c => c.ParentId == categoryId && c.Status == 1).Select(c => c.Id).ToList()
            : new List<int> { categoryId };

        // Retrieve products belonging to the specified categories
        var products = (from pc in db.ProductCategory
                        join p in db.Product on pc.ProductId equals p.Id
                        where categoryIdsToSearch.Contains(pc.CategoryId)
                              && pc.DeletedAt == null
                              && p.DeletedAt == null
                        orderby p.CreatedAt descending
                        select new
                        {
                            p.Id,
                            p.Name,
                            p.ImageThumbPath,
                            p.Code,
                            p.Description,
                            p.SellPrice,
                            p.Quantity,
                            p.CreatedAt,
                        }).ToList();

        if (!products.Any())
        {
            return NotFound(new { message = "No products found in this category." });
        }

        return Ok(new { data = products, total = products.Count });
    }

    private void GetCategoryWithLevel(List<Category> categories, Category currentCategory, int level, List<object> listData)
    {
        var parentCategory = categories.FirstOrDefault(c => c.Id == currentCategory.ParentId);
        // Thêm danh mục hiện tại vào danh sách với cấp bậc.
        listData.Add(new
        {
            currentCategory.Id,
            currentCategory.Name,
            currentCategory.Description,
            currentCategory.CategoryCode,
            currentCategory.imgThumbCategory,
            currentCategory.Status,
            currentCategory.CreatedAt,
            currentCategory.UpdateAt,
            currentCategory.CreatedBy,
            currentCategory.UpdatedBy,
            ParentName = parentCategory?.Name,
            ParentCategoryCode = parentCategory?.CategoryCode,
            ParentId = currentCategory.ParentId,
            Level = level
        });

        // Tìm các danh mục con của danh mục hiện tại.
        var subCategories = categories.Where(c => c.ParentId == currentCategory.Id).ToList();


        foreach (var subCategory in subCategories)
        {
            GetCategoryWithLevel(categories, subCategory, level + 1, listData);
        }
    }

    // POST api/<ResourceController>
    [HttpPost]
    [Authorize]
    public IActionResult Post([FromBody] ResourceRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;
        var resource = new Resource();
        resource.Name = request.Name;
        resource.Description = request.Description;
        resource.Status = request.Status ?? 0;
        resource.Version = 0;
        resource.UpdateAt = DateTime.Now;
        resource.CreatedAt = DateTime.Now;
        resource.UpdatedBy = int.Parse(userId);
        resource.CreatedBy = int.Parse(userId);
        db.Resource.Add(resource);
        db.SaveChanges();
        return Ok(new { data = resource });
    }

    // PUT api/<ResourceController>/5
    [Authorize]
    [HttpPut("{id}")]
    public IActionResult Put(int id, [FromBody] ResourceRequest request)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;

        var resource = db.Resource.FirstOrDefault(c => c.Id == id && c.DeletedAt == null);
        if (resource == null)
        {
            return BadRequest(new { message = "Data not found" });
        }
        if (resource.Version != request.Version)
        {
            return BadRequest(new { type = "reload", message = "Data has change pls reload" });
        }
        resource.Name = request.Name;
        resource.Description = request.Description;
        resource.Status = request.Status ?? 0;
        resource.Version = request.Version + 1;
        resource.UpdateAt = DateTime.Now;
        resource.UpdatedBy = int.Parse(userId);
        db.SaveChanges();
        return Ok(new { data = resource });
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
