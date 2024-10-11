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
                                             cate.Description
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
}
