using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AuthenticationJWT.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProductController : ControllerBase
{
    //private readonly IConfiguration _configuration;
    //private MyContext db;
    //public ProductController(IConfiguration configuration, MyContext myContext)
    //{
    //    _configuration = configuration;
    //    db = myContext;
    //}
    //// GET: api/<ProductController>
    //[HttpGet]
    //[Authorize]
    //public IActionResult Get()
    //{
    //    // Lấy tất cả các danh mục vào bộ nhớ.
    //    var categories = (from item in db.Product
    //                      where item.DeletedAt == null
    //                      orderby item.CreatedAt descending
    //                      select item).ToList();

    //    //// Tạo danh sách chứa kết quả.
    //    var listData = new List<object>();

    //    //// Tìm tất cả các danh mục gốc (ParentId = null).
    //    var rootCategories = categories.Where(c => c.ParentId == null).ToList();

    //    //// Xây dựng danh sách theo cấp bậc bắt đầu từ danh mục gốc.
    //    foreach (var rootProduct in rootCategories)
    //    {
    //        GetProductWithLevel(categories, rootProduct, 0, listData);
    //    }

    //    return Ok(new { data = listData, total = listData.Count() });
    //    //return Ok(new { data = listData, total = listData.Count });
    //}

    //// Phương thức đệ quy để xác định cấp bậc và thêm vào danh sách kết quả.
    //private void GetProductWithLevel(List<Product> categories, Product currentProduct, int level, List<object> listData)
    //{
    //    // Thêm danh mục hiện tại vào danh sách với cấp bậc.
    //    listData.Add(new
    //    {
    //        currentProduct.Id,
    //        currentProduct.Name,
    //        currentProduct.Description,
    //        currentProduct.ProductCode,
    //        currentProduct.Status,
    //        currentProduct.CreatedAt,
    //        currentProduct.UpdateAt,
    //        ParentId = currentProduct.ParentId,
    //        Level = level  // Cấp bậc hiện tại của danh mục.
    //    });

    //    // Tìm các danh mục con của danh mục hiện tại.
    //    var subCategories = categories.Where(c => c.ParentId == currentProduct.Id).ToList();

    //    // Đệ quy cho từng danh mục con, tăng cấp bậc lên 1.
    //    foreach (var subProduct in subCategories)
    //    {
    //        GetProductWithLevel(categories, subProduct, level + 1, listData);
    //    }
    //}


    //// GET api/<ProductController>/5
    //[Authorize]
    //[HttpGet("{id}")]
    //public IActionResult Get(int id)
    //{
    //    var category = (from r in db.Product
    //                    join u in db.User on r.CreatedBy equals u.Id
    //                    join u2 in db.User on r.UpdatedBy equals u2.Id
    //                    where r.Id == id && r.DeletedAt == null
    //                    select new
    //                    {
    //                        Product = r,
    //                        UserCreate = u.Username,
    //                        UserUpdate = u2.Username,
    //                    }).FirstOrDefault();

    //    if (category == null)
    //    {
    //        return BadRequest(new { message = "Data not found" });
    //    }
    //    return Ok(new { data = category });
    //}

    //// POST api/<ProductController>
    //[HttpPost]
    //[Authorize]
    //public IActionResult Post([FromBody] ProductRequest request)
    //{
    //    if (!ModelState.IsValid)
    //    {
    //        return BadRequest(ModelState);
    //    }
    //    // check ParentId
    //    if (request.ParentId.HasValue)
    //    {
    //        var parentProduct = db.Product.FirstOrDefault(c => c.Id == request.ParentId);
    //        if (parentProduct == null)
    //        {
    //            return BadRequest(new { message = "Parent not found." });
    //        }
    //        if (parentProduct.Id == request.ParentId)
    //        {
    //            return BadRequest(new { message = "Parent must not coincide with itself " });
    //        }
    //    }
    //    string categoryCode = GenerateProductCode(request.Name);

    //    var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;
    //    var category = new Product();
    //    category.Name = request.Name;
    //    category.ProductCode = categoryCode;
    //    category.Description = request.Description;
    //    category.ParentId = request.ParentId;
    //    category.Status = request.Status ?? 0;
    //    category.Version = 0;
    //    category.UpdateAt = DateTime.Now;
    //    category.CreatedAt = DateTime.Now;
    //    category.UpdatedBy = int.Parse(userId);
    //    category.CreatedBy = int.Parse(userId);

    //    db.Product.Add(category);
    //    db.SaveChanges();
    //    return Ok(new { data = category });
    //}
    ////GenerateProductCode 
    //private string GenerateProductCode(string name)
    //{

    //    string initialChar = name.Substring(0, 1).ToUpper();


    //    int number = 1;


    //    string categoryCode = initialChar + number;


    //    while (db.Product.Any(c => c.ProductCode == categoryCode))
    //    {
    //        number++;
    //        categoryCode = initialChar + number;
    //    }

    //    return categoryCode;
    //}

    //// PUT api/<ProductController>/5
    //[Authorize]
    //[HttpPut("{id}")]
    //public IActionResult Put(int id, [FromBody] ProductRequest request)
    //{
    //    var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;

    //    var category = db.Product.FirstOrDefault(c => c.Id == id && c.DeletedAt == null);
    //    if (category == null)
    //    {
    //        return BadRequest(new { message = "Data not found" });
    //    }
    //    if (category.Id == request.ParentId)
    //    {
    //        return BadRequest(new { message = "Parent must not coincide with itself " });
    //    }
    //    if (category.Version != request.Version)
    //    {
    //        return BadRequest(new { type = "reload", message = "Data has change pls reload" });
    //    }
    //    string categoryCode = GenerateProductCode(request.Name);

    //    category.Name = request.Name;
    //    category.Description = request.Description;
    //    category.ProductCode = categoryCode;
    //    category.ParentId = request.ParentId;
    //    category.Status = request.Status ?? 0;
    //    category.Version = request.Version + 1;
    //    category.UpdateAt = DateTime.Now;
    //    category.UpdatedBy = int.Parse(userId);
    //    db.SaveChanges();
    //    return Ok(new { data = category });
    //}

    //// DELETE api/<ProductController>/5'
    //[Authorize]
    //[HttpDelete("{id}")]
    //public IActionResult Delete(int id)
    //{
    //    var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;
    //    var category = db.Product.FirstOrDefault(c => c.Id == id && c.DeletedAt == null);
    //    if (category == null)
    //    {
    //        return BadRequest(new { message = "Data not found" });
    //    }
    //    category.DeletedAt = DateTime.Now;
    //    category.UpdatedBy = int.Parse(userId);
    //    db.SaveChanges();
    //    return Ok(new { data = category });

    //}
}
