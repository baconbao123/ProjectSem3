using AuthenticationJWT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using System.Text;

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

            int level = 0; // Default level is 0
            if (request.ParentId.HasValue)
            {
                var parentCategory = db.Category.FirstOrDefault(c => c.Id == request.ParentId);
                if (parentCategory == null)
                {
                    errorMessages.Add(new { message = $"Parent category not found for category: {request.Name}" });
                    continue;
                }
                // Set the level based on the parent category's level
                level = parentCategory.Level + 1;
            }
            var nameCategory = db.Category.FirstOrDefault(c => c.Name == request.Name);

            if (nameCategory != null)
            {

                errorMessages.Add(new { message = $"Name category {request.Name} already exists." });
            }
            if (request.Name == null)
            {
                errorMessages.Add(new { message = $"Name category is require." });
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
                Level = level,
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
        // Convert Vietnamese characters to non-accented characters
        string normalizedString = RemoveDiacritics(name);

        string initialChar = normalizedString.Substring(0, 1).ToUpper(); // Get first character
        int number = 1;
        string categoryCode;

        do
        {
            categoryCode = initialChar + number;
            number++;
        } while (existingCodes.Contains(categoryCode)); // Check against existing codes

        return categoryCode;
    }

    private string RemoveDiacritics(string text)
    {
        if (string.IsNullOrEmpty(text))
            return text;

        // Chuẩn hóa chuỗi về FormD để tách dấu phụ
        var normalizedString = text.Normalize(NormalizationForm.FormD);
        var stringBuilder = new StringBuilder();

        foreach (var c in normalizedString)
        {
            var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
            if (unicodeCategory != UnicodeCategory.NonSpacingMark)
            {
                stringBuilder.Append(c);
            }
        }

        // Chuẩn hóa lại về FormC sau khi loại bỏ dấu phụ
        var result = stringBuilder.ToString().Normalize(NormalizationForm.FormC);

        // Thay thế các ký tự đặc biệt trong tiếng Việt
        result = result.Replace('đ', 'd').Replace('Đ', 'D');

        return result;
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
        // Nếu danh mục có Level = 0, không cho phép thay đổi ParentId
        if (category.Level == 0 && request.ParentId.HasValue)
        {
            return BadRequest(new { message = "Cannot update a root category to become a subcategory." });
        }
        // Kiểm tra xem danh mục cha mới có phải là con của chính nó không
        if (IsSubCategoryOf(category.Id, request.ParentId))
        {
            return BadRequest(new { message = "Cannot make a category a subcategory of its own subcategories." });
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

        int newLevel = 0; // Default level is 0
        if (request.ParentId.HasValue)
        {
            var parentCategory = db.Category.FirstOrDefault(c => c.Id == request.ParentId);
            if (parentCategory == null)
            {
                return BadRequest(new { message = "Parent category not found." });
            }
            newLevel = parentCategory.Level + 1;
        }

        // Update category properties
        category.Name = request.Name;
        category.Description = request.Description;
        category.CategoryCode = categoryCode;
        category.ParentId = request.ParentId;
        category.Level = newLevel;
        category.Status = request.Status ?? 0;
        category.Version = request.Version + 1;
        category.UpdateAt = DateTime.Now;
        category.UpdatedBy = int.Parse(userId);
        // Disable all subcategories before deleting the category
        UpdateSubCategoryStatus(category.Id, category.Status);
        // Update all subcategories with the new level
        UpdateSubCategoryLevel(category.Id, newLevel);

        // Save changes to the database
        db.SaveChanges();

        return Ok(new { data = category });
    }
    // Method to check if a category is a subcategory of another
    private bool IsSubCategoryOf(int categoryId, int? parentId)
    {
        if (!parentId.HasValue) return false;

        var parentCategory = db.Category.FirstOrDefault(c => c.Id == parentId.Value && c.DeletedAt == null);
        if (parentCategory == null) return false;

        // Nếu parentId là categoryId hoặc một trong các subcategory của categoryId, trả về true
        if (parentCategory.Id == categoryId)
        {
            return true;
        }

        // Kiểm tra tiếp tục xem danh mục cha này có phải là con của category hay không
        return IsSubCategoryOf(categoryId, parentCategory.ParentId);
    }
    // Method to update subcategory levels recursively
    private void UpdateSubCategoryLevel(int parentId, int parentLevel)
    {
        var subCategories = db.Category.Where(c => c.ParentId == parentId && c.DeletedAt == null).ToList();
        foreach (var subCategory in subCategories)
        {
            subCategory.Level = parentLevel + 1;
            UpdateSubCategoryLevel(subCategory.Id, subCategory.Level); // Recursively update the levels of subcategories
        }
    }

    // Method to activate or disable all subcategories
    private void UpdateSubCategoryStatus(int parentId, int status)
    {
        // Lấy tất cả danh mục con có parentId là danh mục cha và chưa bị xóa (DeletedAt == null)
        var subCategories = db.Category.Where(c => c.ParentId == parentId && c.DeletedAt == null).ToList();

        foreach (var subCategory in subCategories)
        {
            // Cập nhật trạng thái của danh mục con
            subCategory.Status = status;

            // Đệ quy để cập nhật trạng thái cho tất cả các danh mục con cấp dưới
            UpdateSubCategoryStatus(subCategory.Id, status);
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
        category.Status = 0;
        db.SaveChanges();

        return Ok(new { data = category });
    }
    private void DisableSubCategories(int parentId)
    {
        // Lấy tất cả danh mục con có parentId là danh mục cha và chưa bị xóa (DeletedAt == null)
        var subCategories = db.Category.Where(c => c.ParentId == parentId && c.DeletedAt == null).ToList();

        foreach (var subCategory in subCategories)
        {

            subCategory.Status = 0;


            DisableSubCategories(subCategory.Id);
        }
    }
}
