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
}
