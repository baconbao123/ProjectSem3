using AuthenticationJWT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuthenticationJWT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SaleController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly MyContext db;
        private readonly ILogger<SaleController> _logger;

        public SaleController(IConfiguration configuration, MyContext myContext, ILogger<SaleController> logger)
        {
            _configuration = configuration;
            db = myContext;
            _logger = logger;
        }

        // GET: api/<SaleController>
        [HttpGet]
        [Authorize]
        public IActionResult Get()
        {
            UpdateExpiredSales();

            var listData = (from item in db.Sale
                            where item.DeletedAt == null
                            orderby item.CreatedAt descending
                            select item).ToList();

            return Ok(new { data = listData, total = listData.Count() });
        }

        // GET api/<SaleController>/5
        [HttpGet("{id}")]
        [Authorize]
        public IActionResult Get(int id)
        {
            UpdateExpiredSales();

            var author = (from s in db.Sale
                          join u in db.User on s.CreatedBy equals u.Id
                          join u2 in db.User on s.UpdatedBy equals u2.Id
                          where s.Id == id && s.DeletedAt == null
                          select new
                          {
                              Sale = s,
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
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;

            var sale = new Sale
            {
                Name = request.Name,
                Discount = request.Discount / 100,
                Type = request.Type,
                StartDate = request.StartDate ?? DateTime.MinValue,
                EndDate = request.EndDate ?? DateTime.MinValue,
                Quantity = request.Quantity,
                CategoryId = request.CategoryId,
                Status = request.Status ?? 0,
                Version = 0,
                CreatedAt = DateTime.Now,
                UpdateAt = DateTime.Now,
                CreatedBy = int.Parse(userId),
                UpdatedBy = int.Parse(userId)
            };

            db.Sale.Add(sale);
            db.SaveChanges();

            return Ok(new { data = sale });
        }

        // PUT api/<SaleController>/5
        [HttpPut("{id}")]
        [Authorize]
        public IActionResult Put(int id, [FromBody] SaleRequest request)
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;

            var sale = db.Sale.FirstOrDefault(c => c.Id == id && c.DeletedAt == null);
            if (sale == null)
            {
                return BadRequest(new { message = "Data not found" });
            }
            if (sale.Version != request.Version)
            {
                return BadRequest(new { type = "reload", message = "Data has changed, please reload" });
            }
            sale.Name = request.Name;
            sale.StartDate = request.StartDate ?? DateTime.MinValue;
            sale.EndDate = request.EndDate ?? DateTime.MinValue;
            sale.Discount = request.Discount / 100;
            sale.Type = request.Type;
            sale.Status = request.Status ?? 0;
            sale.Version = request.Version + 1;
            sale.Quantity = request.Quantity;
            sale.CategoryId = request.CategoryId;
            sale.UpdateAt = DateTime.Now;
            sale.UpdatedBy = int.Parse(userId);
            db.SaveChanges();
            return Ok(new { data = sale });
        }

        // DELETE api/<SaleController>/5
        [HttpDelete("{id}")]
        [Authorize]
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

        /// <summary>
        /// Phương thức kiểm tra và cập nhật các Sale đã hết hạn.
        /// </summary>
        private void UpdateExpiredSales()
        {
            var now = DateTime.Now;
            _logger.LogInformation($"Starting UpdateExpiredSales at {now}");

            // Tìm các Sale đã hết hạn và vẫn đang active
            var expiredSales = db.Sale
                                 .Where(s => s.EndDate < now && s.Status == 1 && s.DeletedAt == null)
                                 .ToList();

            _logger.LogInformation($"Found {expiredSales.Count} expired sales.");

            if (expiredSales.Any())
            {
                foreach (var sale in expiredSales)
                {
                    sale.Status = 0;
                    sale.UpdateAt = now; // Cập nhật trường UpdateAt nếu cần
                    // sale.UpdatedBy = ...; // Cập nhật trường UpdatedBy nếu cần
                }

                db.SaveChanges();
                _logger.LogInformation($"Updated {expiredSales.Count} sales to Status = 0.");
            }
            else
            {
                _logger.LogInformation("No expired sales to update.");
            }
        }
    }
}
