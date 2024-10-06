using AuthenticationJWT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AuthenticationJWT.Controllers;
[Route("api/[controller]")]
[ApiController]
public class SaleController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private MyContext db;
    public SaleController(IConfiguration configuration, MyContext myContext)
    {
        _configuration = configuration;
        db = myContext;
    }
    // GET: api/<SaleController>
    [HttpGet]
    [Authorize]
    public IActionResult get()
    {
        var listData = (from item in db.Sale
                        where item.DeletedAt == null
                        orderby item.CreatedAt descending
                        select item).ToList();

        return Ok(new { data = listData, total = listData.Count() });
    }

    // GET api/<SaleController>/5
    [Authorize]
    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        var author = (from r in db.Author
                      join u in db.User on r.CreatedBy equals u.Id
                      join u2 in db.User on r.UpdatedBy equals u2.Id
                      where r.Id == id && r.DeletedAt == null
                      select new
                      {
                          Author = r,
                          UserCreate = u.Username,
                          UserUpdate = u2.Username,

                      }).FirstOrDefault();

        if (author == null)
        {
            return BadRequest(new { message = "Data not found" });
        }
        return Ok(new { data = author });
    }

    // POST api/<SaleController>
    [HttpPost]
    [Authorize]
    public IActionResult Post([FromBody] SaleRequest request)
    {
        // Kiểm tra tính hợp lệ của dữ liệu gửi lên
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Lấy userId từ claim
        var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;

        // Tạo một đối tượng Sale mới
        var sale = new Sale
        {
            Name = request.Name,
            Discount = request.Discount / 100,
            Type = request.Type,
            StartDate = request.StartDate ?? DateTime.MinValue,
            EndDate = request.EndDate ?? DateTime.MinValue,
            Status = request.Status ?? 0,
            Version = 0,
            CreatedAt = DateTime.Now,
            UpdateAt = DateTime.Now,
            CreatedBy = int.Parse(userId),
            UpdatedBy = int.Parse(userId)
        };

        // Lưu đối tượng Sale vào cơ sở dữ liệu
        db.Sale.Add(sale);
        db.SaveChanges();

        // Trả về dữ liệu đã tạo
        return Ok(new { data = sale });
    }


    // PUT api/<SaleController>/5
    [Authorize]
    [HttpPut("{id}")]
    public IActionResult Put(int id, [FromBody] SaleRequest request)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;

        var sale = db.Author.FirstOrDefault(c => c.Id == id && c.DeletedAt == null);
        //if (author == null)
        //{
        //    return BadRequest(new { message = "Data not found" });
        //}
        //if (author.Version != request.Version)
        //{
        //    return BadRequest(new { type = "reload", message = "Data has change please reload" });
        //}
        //author.Name = request.Name;
        //author.Birth = request.DateOfBirth;
        //author.Biography = request.Biography;
        //author.Status = request.Status ?? 0;
        //author.Version = request.Version + 1;
        //author.UpdateAt = DateTime.Now;
        //author.UpdatedBy = int.Parse(userId);
        //db.SaveChanges();
        return Ok(new { data = sale });
    }

    // DELETE api/<SaleController>/5'
    [Authorize]
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;
        var sale = db.Sale.FirstOrDefault(c => c.Id == id && c.DeletedAt == null);
        if (sale == null)
        {
            return BadRequest(new { message = "Data not found" });
        }
        sale.DeletedAt = DateTime.Now;
        sale.UpdatedBy = int.Parse(userId);
        db.SaveChanges();
        return Ok(new { data = sale });

    }
}
