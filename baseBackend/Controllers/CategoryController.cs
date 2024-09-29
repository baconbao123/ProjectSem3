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

        var categories = db.Category
                      .Where(c => c.DeletedAt == null).ToList();


        var listData = new List<object>();


        var rootCategories = categories.Where(c => c.ParentId == null).ToList();


        foreach (var rootCategory in rootCategories)
        {
            GetCategoryWithLevel(categories, rootCategory, 0, listData);
        }

        return Ok(new { data = listData, total = listData.Count() });
        //return Ok(new { data = listData, total = listData.Count });
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


    // GET api/<CategoryController>/5
    [Authorize]
    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        var category = (from r in db.Category
                        join u in db.User on r.CreatedBy equals u.Id into createdByGroup
                        from u in createdByGroup.DefaultIfEmpty()
                        join u2 in db.User on r.UpdatedBy equals u2.Id into updatedByGroup
                        from u2 in updatedByGroup.DefaultIfEmpty()
                        join r1 in db.Category on r.ParentId equals r1.Id into parentGroup
                        from r1 in parentGroup.DefaultIfEmpty()
                        where r.Id == id && r.DeletedAt == null
                        select new
                        {
                            Category = r,
                            ParentName = r1.Name,
                            UserCreate = u.Username,
                            UserUpdate = u2.Username,
                        }).FirstOrDefault();

        if (category == null)
        {
            return NotFound(new { message = "Data not found" });
        }

        return Ok(new { data = category });
    }

    // POST api/<CategoryController>
    [HttpPost]
    [Authorize]
    public IActionResult Post([FromBody] List<CategoryRequest> requests)
    {
        var errorMessages = new List<object>();
        var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { message = "User ID is not provided." });
        }

        var categories = new List<Category>();
        var existingCategoryCodes = db.Category.Select(c => c.CategoryCode).ToHashSet(); // Fetch existing codes
        foreach (var request in requests)
        {
            if (!TryValidateModel(request))
            {
                errorMessages.Add(new { message = $"Validation failed for category: {request.Name}", errors = ModelState.Values.SelectMany(v => v.Errors) });
                continue;
            }

            if (request.ParentId.HasValue)
            {
                var parentCategory = db.Category.FirstOrDefault(c => c.Id == request.ParentId);
                if (parentCategory == null)
                {
                    errorMessages.Add(new { message = $"Parent category not found for category: {request.Name}" });
                    continue;
                }



            }

            string categoryCode;
            try
            {
                categoryCode = GenerateUniqueCategoryCode(request.Name, existingCategoryCodes);
                existingCategoryCodes.Add(categoryCode); // Add the new code to the set
            }
            catch (Exception ex)
            {
                errorMessages.Add(new { message = $"Error generating category code for {request.Name}.", details = ex.Message });
                continue;
            }

            var category = new Category
            {
                Name = request.Name,
                CategoryCode = categoryCode,
                Description = request.Description,
                ParentId = request.ParentId,
                Status = request.Status ?? 0,
                Version = 0,
                UpdateAt = DateTime.Now,
                CreatedAt = DateTime.Now,
                UpdatedBy = int.Parse(userId),
                CreatedBy = int.Parse(userId)
            };

            categories.Add(category);
        }

        if (errorMessages.Count > 0)
        {
            return BadRequest(new { message = "Some categories failed validation or processing.", errors = errorMessages });
        }

        if (categories.Count > 0)
        {
            db.Category.AddRange(categories);
            db.SaveChanges();
        }
        else
        {
            return BadRequest(new { message = "No categories to add." });
        }

        return Ok(new { data = categories });
    }

    // Generate a unique category code
    private string GenerateUniqueCategoryCode(string name, HashSet<string> existingCodes)
    {
        string initialChar = name.Substring(0, 1).ToUpper();
        int number = 1;
        string categoryCode;

        do
        {
            categoryCode = initialChar + number;
            number++;
        } while (existingCodes.Contains(categoryCode)); // Check against existing codes

        return categoryCode;
    }
    // PUT api/<CategoryController>/5
    [Authorize]
    [HttpPut("{id}")]
    public IActionResult Put(int id, [FromBody] CategoryRequest request)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { message = "User ID is not provided." });
        }

        var category = db.Category.FirstOrDefault(c => c.Id == id && c.DeletedAt == null);
        if (category == null)
        {
            return BadRequest(new { message = "Data not found" });
        }

        if (category.Id == request.ParentId)
        {
            return BadRequest(new { message = "Category cannot be its own parent." });
        }

        if (category.Version != request.Version)
        {
            return BadRequest(new { type = "reload", message = "Data has changed, please reload." });
        }

        // Fetch existing category codes including the one being updated to allow for reuse
        var existingCategoryCodes = db.Category
            .Where(c => c.Id != id && c.DeletedAt == null)
            .Select(c => c.CategoryCode)
            .ToHashSet();

        string categoryCode;
        try
        {
            categoryCode = GenerateUniqueCategoryCode(request.Name, existingCategoryCodes);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = $"Error generating category code for {request.Name}.", details = ex.Message });
        }

        // Update category properties
        category.Name = request.Name;
        category.Description = request.Description;
        category.CategoryCode = categoryCode;
        category.ParentId = request.ParentId;
        category.Status = request.Status ?? 0;
        category.Version = request.Version + 1;
        category.UpdateAt = DateTime.Now;
        category.UpdatedBy = int.Parse(userId);


        if (category.ParentId.HasValue)
        {
            var parentCategory = db.Category.FirstOrDefault(c => c.Id == category.ParentId);
            if (parentCategory != null)
            {
                if (parentCategory.Status == 0)
                {

                    category.Status = 0;
                    return BadRequest(new { message = "Cannot activate this category because its parent category is inactive." });
                }
                else
                {

                    category.Status = 1;
                }
            }
            else
            {
                return BadRequest(new { message = "Parent category not found." });
            }
        }



        UpdateSubCategoryStatus(category.Id, category.Status);


        // Save changes to the database
        db.SaveChanges();

        return Ok(new { data = category });
    }

    // Phương thức để cập nhật trạng thái của danh mục con
    private void UpdateSubCategoryStatus(int parentId, int parentStatus)
    {
        var subCategories = db.Category.Where(c => c.ParentId == parentId && c.DeletedAt == null).ToList();
        foreach (var subCategory in subCategories)
        {
            // Cập nhật trạng thái cho danh mục con
            subCategory.Status = parentStatus; // Gán trạng thái của danh mục cha cho danh mục con
                                               // Gọi đệ quy để cập nhật các danh mục con của danh mục con
            UpdateSubCategoryStatus(subCategory.Id, parentStatus);
        }
    }
    // Method to disable all subcategories
    private void DisableSubCategories(int parentId)
    {
        var subCategories = db.Category.Where(c => c.ParentId == parentId && c.DeletedAt == null).ToList();
        foreach (var subCategory in subCategories)
        {
            subCategory.Status = 0; // Disable the subcategory
            DisableSubCategories(subCategory.Id); // Recursively disable sub-subcategories if needed
        }
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

        // Disable all subcategories before deleting the category
        DisableSubCategories(category.Id);

        category.DeletedAt = DateTime.Now; // Or set the status to disabled instead of deleting
        category.UpdatedBy = int.Parse(userId);
        db.SaveChanges();

        return Ok(new { data = category });
    }

}
