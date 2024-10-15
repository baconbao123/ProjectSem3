using Microsoft.AspNetCore.Mvc;

namespace AuthenticationJWT.Controllers;
[Route("api/[controller]")]
[ApiController]
public class ProductFEController : Controller
{
    private MyContext context;

    public ProductFEController(MyContext context)
    {
        this.context = context;
    }

    [HttpGet]
    public IActionResult GetAllProducts()
    {
        var listData = (from item in context.Product
                        join partner in context.CompanyPartner on item.CompanyPartnerId equals partner.Id
                        join productCategory in context.ProductCategory on item.Id equals productCategory.ProductId
                        join category in context.Category on productCategory.CategoryId equals category.Id
                        where item.DeletedAt == null && item.Status == 1
                              && !context.ProductCategory.Any(pc => pc.ProductId == item.Id
                                                                && context.Category.Any(c => c.Id == pc.CategoryId && c.Status != 1))
                        orderby item.CreatedAt descending
                        select new
                        {
                            item.Id,
                            item.Code,
                            item.Name,
                            item.Description,
                            item.ImageThumbPath,
                            // Fetch company partner name
                            CategoryName = category.Name,
                            CompanyPartnerName = partner.Name,
                            item.Version,
                            item.Status,
                            item.BasePrice,
                            item.SellPrice,
                            item.Quantity,
                            item.CreatedAt,
                            item.UpdateAt,


                            //// Fetch categories only if active
                            //Categories = (from pc in context.ProductCategory
                            //              join cate in context.Category on pc.CategoryId equals cate.Id
                            //              where pc.ProductId == item.Id && cate.Status == 1
                            //              select new
                            //              {
                            //                  cate.Id,
                            //                  cate.CategoryCode,
                            //                  cate.Description
                            //              }).ToList(),

                            //// Fetch authors of the product
                            //Authors = (from ap in context.AuthorProduct
                            //           join author in context.Author on ap.AuthorId equals author.Id
                            //           where ap.ProductId == item.Id
                            //           select new
                            //           {
                            //               author.Name
                            //           }).ToList(),


                        }).ToList();

        return Ok(new { data = listData, total = listData.Count });
    }

    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {

        var product = (from item in context.Product
                       join partner in context.CompanyPartner on item.CompanyPartnerId equals partner.Id
                       join u in context.User on item.UpdatedBy equals u.Id
                       join u2 in context.User on item.CreatedBy equals u2.Id
                       where item.DeletedAt == null
                             && item.Status == 1
                             && item.Id == id
                       orderby item.CreatedAt descending
                       select new
                       {
                           item.Id,
                           item.Code,
                           item.Name,
                           item.Description,
                           item.Version,
                           CompanyPartnerName = partner.Name,
                           CompanyPartnerId = partner.Id,
                           item.ImageThumbPath,
                           item.Status,
                           item.BasePrice,
                           item.SellPrice,
                           item.Quantity,
                           item.CreatedAt,
                           item.UpdateAt,
                           UpdatedBy = u.Username,
                           CreatedBy = u2.Username,
                           Categories = (from pc in context.ProductCategory
                                         join cate in context.Category on pc.CategoryId equals cate.Id
                                         where pc.ProductId == item.Id && cate.Status == 1
                                         select new
                                         {
                                             cate.Id,
                                             cate.Name,
                                             cate.CategoryCode,
                                             cate.Description,
                                             cate.Level,
                                             cate.ParentId
                                         }).ToList(),

                           Authors = (from ap in context.AuthorProduct
                                      join author in context.Author on ap.AuthorId equals author.Id
                                      where ap.ProductId == item.Id
                                      select new
                                      {
                                          author.Id,
                                          author.Name
                                      }).ToList(),

                           ProductImages = context.ProductImage
                                                 .Where(pi => pi.ProductId == item.Id)
                                                 .Select(pi => pi.ImagePath)
                                                 .ToList(),

                       }).ToList();




        if (product == null)
        {
            return BadRequest(new { message = "Data not found" });
        }
        return Ok(new { data = product });
    }

    [HttpGet("TopSellingProducts")]
    public IActionResult GetTopSellingProducts()
    {
        var totalQuantitySold = context.OrderProduct
            .Where(op => op.DeletedAt == null)
            .Sum(op => op.Quantity);

        var topSellingProducts = context.OrderProduct
            .Where(op => op.DeletedAt == null)
            .GroupBy(op => op.ProductId)
            .Select(g => new
            {
                ProductId = g.Key,
                TotalQuantitySold = g.Sum(op => op.Quantity),
                ProductInfo = context.Product
                    .Where(p => p.Id == g.Key)
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.SellPrice,
                        p.BasePrice,
                        p.ImageThumbPath,
                        CompanyPartnerName = context.CompanyPartner
                            .Where(c => c.Id == p.CompanyPartnerId)
                            .Select(c => c.Name)
                            .FirstOrDefault()
                    })
                    .FirstOrDefault()
            })
            .OrderByDescending(x => x.TotalQuantitySold)
            .Take(6)
            .ToList();

        if (!topSellingProducts.Any())
        {
            return Ok(new { data = new object[] { }, message = "No products sold." });
        }

        var topSellingProductsWithPercentage = topSellingProducts.Select(p => new
        {
            ProductId = p.ProductId,
            TotalQuantitySold = p.TotalQuantitySold,
            PercentageOfTotal = totalQuantitySold > 0 ? (p.TotalQuantitySold / totalQuantitySold) * 100 : 0,
            Product = new
            {
                p.ProductInfo.Id,
                p.ProductInfo.Name,
                p.ProductInfo.SellPrice,
                p.ProductInfo.BasePrice,
                p.ProductInfo.ImageThumbPath,

                CompanyName = p.ProductInfo.CompanyPartnerName
            }
        }).ToList();

        return Ok(new { data = topSellingProductsWithPercentage });
    }

    [HttpGet("category/{categoryId}")]
    public IActionResult GetProductByCategory(int categoryId)
    {
        var category = context.Category.FirstOrDefault(c => c.Id == categoryId && c.Status == 1);
        if (category == null)
        {
            return BadRequest(new { message = "Category not found or not active." });
        }

        var products = (from pc in context.ProductCategory
                        join p in context.Product on pc.ProductId equals p.Id
                        where pc.CategoryId == categoryId && pc.DeletedAt == null && p.DeletedAt == null
                        orderby p.CreatedAt descending
                        select new
                        {
                            p.Id,
                            p.Name,
                            p.ImageThumbPath,
                            p.Description,
                            p.SellPrice,
                            p.Quantity,
                            p.CreatedAt,
                        }).ToList();

        if (!products.Any())
        {
            return BadRequest(new { message = "No products found in this category." });
        }

        return Ok(new { data = products, total = products.Count });
    }
}
