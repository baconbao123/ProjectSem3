using AuthenticationJWT.Models;
using Microsoft.AspNetCore.Mvc;

namespace AuthenticationJWT.Controllers;
[Route("api/[controller]")]
[ApiController]
public class CategoriesFEController : Controller
{
    private MyContext context;

    public CategoriesFEController(MyContext context)
    {
        this.context = context;
    }

    [HttpGet]
    public IActionResult GetAllCategoriesWithProducts()
    {
        // Fetch all active categories (both parent and child) that are not deleted
        var categories = context.Category
            .Where(c => c.Status == 1 && c.DeletedAt == null)
            .Select(c => new
            {
                c.Id,
                c.Name,
                c.ParentId,
                c.Level,
                c.imgThumbCategory,
            })
            .ToList();

        if (!categories.Any())
        {
            return BadRequest(new { message = "No categories found." });
        }

        // Prepare a list to hold the categories with their products
        var categoriesWithProducts = new List<object>();

        foreach (var category in categories)
        {
            // Fetch products for the current category and its child categories
            var categoryIds = context.Category
                .Where(c => c.Status == 1 && c.DeletedAt == null && (c.Id == category.Id || c.ParentId == category.Id))
                .Select(c => c.Id)
                .ToList();

            var products = (from pc in context.ProductCategory
                            join p in context.Product on pc.ProductId equals p.Id
                            join partner in context.CompanyPartner on p.CompanyPartnerId equals partner.Id
                            where categoryIds.Contains(pc.CategoryId) && p.DeletedAt == null
                            orderby p.CreatedAt descending
                            select new
                            {
                                p.Id,
                                p.Name,
                                p.SellPrice,
                                p.ImageThumbPath,
                                CompanyPartnerName = partner.Name,
                                // Fetch images of the product and materialize them with ToList()
                                //ProductImages = db.ProductImage
                                //                 .Where(pi => pi.ProductId == p.Id)
                                //                 .Select(pi => pi.ImagePath)
                                //                 .ToList(),
                                p.CreatedAt
                            }).ToList();

            // Remove duplicates after the query execution (if needed)
            var distinctProducts = products.GroupBy(p => p.Id).Select(g => g.First()).ToList();

            // Add the category and its products to the result list
            categoriesWithProducts.Add(new
            {
                category.Id,
                category.Name,
                category.ParentId,
                category.imgThumbCategory,
                category.Level,
                Products = distinctProducts
            });
        }

        return Ok(new { data = categoriesWithProducts, totalCategories = categoriesWithProducts.Count });
    }

    [HttpGet("getCategories")]
    public IActionResult GetAllCategories()
    {
        var categories = context.Category
              .Where(c => c.DeletedAt == null).ToList();


        var listData = new List<object>();


        var rootCategories = categories.Where(c => c.ParentId == null).ToList();


        foreach (var rootCategory in rootCategories)
        {
            GetCategoryWithLevel(categories, rootCategory, 0, listData);
        }

        return Ok(new { data = listData, total = listData.Count() });
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
}
