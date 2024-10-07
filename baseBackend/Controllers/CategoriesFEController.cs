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
    public IActionResult GetAllCategories()
    {
        // Fetch all active categories (both parent and child) that are not deleted
        var categories = context.Category
            .Where(c => c.Status == 1 && c.DeletedAt == null)
            .Select(c => new
            {
                c.Id,
                c.Name,
                c.ParentId,
                c.Level
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

            // Fetch products across the category and its child categories, ensuring no duplicates
            var products = (from pc in context.ProductCategory
                            join p in context.Product on pc.ProductId equals p.Id
                            where categoryIds.Contains(pc.CategoryId) && p.DeletedAt == null
                            orderby p.CreatedAt descending
                            select new
                            {
                                p.Id,
                                p.Name,
                                //p.Description,
                                p.SellPrice,
                                //p.Quantity,
                                p.CreatedAt
                            }).Distinct().ToList(); // Use Distinct() to ensure no duplicate products

            // Add the category and its products to the result list
            categoriesWithProducts.Add(new
            {
                category.Id,
                category.Name,
                category.ParentId,
                category.Level,
                Products = products
            });
        }

        return Ok(new { data = categoriesWithProducts, totalCategories = categoriesWithProducts.Count });
    }
}
