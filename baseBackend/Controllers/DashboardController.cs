using Microsoft.AspNetCore.Mvc;

namespace AuthenticationJWT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : Controller
    {
        private readonly IConfiguration _configuration;
        private MyContext db;

        public DashboardController(IConfiguration configuration, MyContext myContext)
        {
            _configuration = configuration;
            db = myContext;
        }

        [HttpGet("CategoryProductQuantity")]
        //[Authorize]
        public IActionResult GetQuantityProductWithCategory()
        {
            // Fetch all active categories (both parent and child) that are not deleted
            var categories = db.Category
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
                var categoryIds = db.Category
                    .Where(c => c.Status == 1 && c.DeletedAt == null && (c.Id == category.Id || c.ParentId == category.Id))
                    .Select(c => c.Id)
                    .ToList();

                var products = (from pc in db.ProductCategory
                                join p in db.Product on pc.ProductId equals p.Id
                                join partner in db.CompanyPartner on p.CompanyPartnerId equals partner.Id
                                where categoryIds.Contains(pc.CategoryId) && p.DeletedAt == null
                                orderby p.CreatedAt descending
                                select new
                                {
                                    p.Id,
                                    p.Name,
                                    p.ImageThumbPath,
                                }).ToList();

                // Remove duplicates after the query execution (if needed)
                var distinctProducts = products.GroupBy(p => p.Id).Select(g => g.First()).ToList();

                // Add the category, product count, and its products to the result list
                categoriesWithProducts.Add(new
                {
                    category.Id,
                    category.Name,
                    category.ParentId,
                    category.Level,
                    ProductCount = distinctProducts.Count,
                    Products = distinctProducts
                });
            }

            return Ok(new { data = categoriesWithProducts, totalCategories = categoriesWithProducts.Count });
        }

        [HttpGet("ProductInStock")]
        //[Authorize]
        public IActionResult GetQuantityProductInStock()
        {
            // Lấy danh sách số lượng cho từng sản phẩm, chỉ tính những sản phẩm chưa bị xóa
            var productQuantities = db.Product
                .Where(p => p.DeletedAt == null) // Chỉ lấy các sản phẩm chưa bị xóa
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Quantity // Giả sử bảng Product có cột Quantity để lưu trữ số lượng sản phẩm
                })
                .ToList();

            if (!productQuantities.Any())
            {
                return BadRequest(new { message = "No products found." });
            }

            // Trả về danh sách kết quả
            return Ok(new { data = productQuantities, TotalProducts = productQuantities.Count });
        }
        [HttpGet("CustomerGrowth")]
        //[Authorize]
        public IActionResult GetCustomerGrowth()
        {
            // Ngày hiện tại
            var currentDate = DateTime.Now;

            // Lấy tất cả khách hàng trong cơ sở dữ liệu
            var allCustomers = db.User
                .Where(u => u.DeletedAt == null) // Lọc các khách hàng chưa bị xóa
                .ToList();

            // Tính toán cho tháng hiện tại
            var currentMonthCount = allCustomers
                .Count(u => u.CreatedAt.HasValue &&
                            u.CreatedAt.Value.Month == currentDate.Month &&
                            u.CreatedAt.Value.Year == currentDate.Year);

            // Tính toán cho tháng trước
            var previousMonthCount = allCustomers
                .Count(u => u.CreatedAt.HasValue &&
                            u.CreatedAt.Value.Month == currentDate.AddMonths(-1).Month &&
                            u.CreatedAt.Value.Year == currentDate.AddMonths(-1).Year);

            // Tính tỷ lệ tăng trưởng
            double growthRate = previousMonthCount > 0
                ? ((double)(currentMonthCount - previousMonthCount) / previousMonthCount) * 100
                : 0;

            // Chuẩn bị kết quả trả về
            var result = new
            {
                TotalCustomers = allCustomers.Count,
                TotalCurrentMonthUsers = currentMonthCount,
                GrowthRatePercentage = growthRate,

            };

            return Ok(result);
        }

        [HttpGet("CustomerGrowthForYear")]
        //[Authorize]
        public IActionResult GetCustomerGrowthForYear(int year)
        {
            // Danh sách để lưu trữ số lượng người dùng đăng ký và tỷ lệ tăng trưởng cho từng tháng
            var growthData = new List<object>();


            for (int month = 1; month <= 12; month++)
            {
                // Tính số lượng người dùng đăng ký trong tháng hiện tại
                var currentMonthCount = db.User
                    .Where(u => u.DeletedAt == null && u.CreatedAt.HasValue &&
                                u.CreatedAt.Value.Month == month &&
                                u.CreatedAt.Value.Year == year)
                    .Count();


                var previousMonthCount = month > 1
                    ? db.User
                        .Where(u => u.DeletedAt == null && u.CreatedAt.HasValue &&
                                    u.CreatedAt.Value.Month == (month - 1) &&
                                    u.CreatedAt.Value.Year == year)
                        .Count()
                    : 0;

                // Tính tỷ lệ tăng trưởng
                double growthRate = previousMonthCount > 0
                    ? ((double)(currentMonthCount - previousMonthCount) / previousMonthCount) * 100
                    : 0;

                // Thêm dữ liệu vào danh sách
                growthData.Add(new
                {
                    Month = month,
                    Year = year,
                    TotalUsers = currentMonthCount,
                    GrowthRatePercentage = growthRate
                });
            }

            // Trả về kết quả
            return Ok(new { data = growthData });
        }


        [HttpGet("CompanyGrowth")]
        //[Authorize]
        public IActionResult GetCompanyGrowth()
        {
            // Ngày hiện tại
            var currentDate = DateTime.Now;

            // Tính toán cho tháng hiện tại
            var currentMonthCount = db.CompanyPartner
                .Where(u => u.DeletedAt == null && u.CreatedAt.HasValue &&
                            u.CreatedAt.Value.Month == currentDate.Month &&
                            u.CreatedAt.Value.Year == currentDate.Year)
                .Count();

            // Tính toán cho tháng trước
            var previousMonthCount = db.CompanyPartner
                .Where(u => u.DeletedAt == null && u.CreatedAt.HasValue &&
                            u.CreatedAt.Value.Month == currentDate.AddMonths(-1).Month &&
                            u.CreatedAt.Value.Year == currentDate.AddMonths(-1).Year)
                .Count();

            // Tính tỷ lệ tăng trưởng
            double growthRate = previousMonthCount > 0
                ? ((double)(currentMonthCount - previousMonthCount) / previousMonthCount) * 100
                : 0;

            // Chuẩn bị kết quả trả về
            var result = new
            {
                TotalCurrentMonthCompany = currentMonthCount,
                GrowthRatePercentage = growthRate
            };

            return Ok(result);
        }

        [HttpGet("AuthorTotal")]
        public IActionResult GetAuthorTotal()
        {
            var listData = db.Author
                .Where(a => a.DeletedAt == null).Count();
            return Ok(listData);
        }
        [HttpGet("ProfitGrowth/{year}")]
        //[Authorize]
        public IActionResult GetProfitGrowthByYear(int year)
        {
            // Lưu trữ dữ liệu lợi nhuận theo từng tháng trong năm
            var profitData = new List<object>();

            // Lặp qua từng tháng trong năm (12 tháng)
            for (int monthOffset = 0; monthOffset < 12; monthOffset++)
            {
                var monthStartDate = new DateTime(year, monthOffset + 1, 1);
                var monthEndDate = monthStartDate.AddMonths(1);

                // Tính tổng lợi nhuận cho tháng hiện tại
                var totalProfit = db.OrderProduct
                    .Where(op => op.DeletedAt == null &&
                                 op.CreatedAt.HasValue &&
                                 op.CreatedAt.Value >= monthStartDate &&
                                 op.CreatedAt.Value < monthEndDate)
                    .Sum(op => op.Profit);

                // Tính tổng lợi nhuận cho tháng trước đó
                double previousMonthProfit = monthOffset == 0 ? 0 : db.OrderProduct
                    .Where(op => op.DeletedAt == null &&
                                 op.CreatedAt.HasValue &&
                                 op.CreatedAt.Value >= monthStartDate.AddMonths(-1) &&
                                 op.CreatedAt.Value < monthStartDate)
                    .Sum(op => op.Profit);

                // Tính tỷ lệ tăng trưởng lợi nhuận
                double growthRate = previousMonthProfit > 0
                    ? ((double)(totalProfit - previousMonthProfit) / previousMonthProfit) * 100
                    : (totalProfit > 0 ? 100 : 0); // Nếu không có lợi nhuận tháng trước thì coi là 100%

                // Thêm dữ liệu vào danh sách
                profitData.Add(new
                {
                    Month = monthStartDate.ToString("MMMM"),
                    TotalProfit = totalProfit,
                    GrowthRatePercentage = growthRate
                });
            }

            // Trả về kết quả
            return Ok(new { data = profitData });
        }
        [HttpGet("CurrentMonthProfit")]
        //[Authorize]
        public IActionResult GetCurrentMonthProfit()
        {
            var currentDate = DateTime.Now;
            var startOfMonth = new DateTime(currentDate.Year, currentDate.Month, 1);
            var endOfMonth = startOfMonth.AddMonths(1);

            // Tính tổng lợi nhuận của tháng hiện tại
            var currentMonthProfit = db.OrderProduct
                .Where(op => op.DeletedAt == null &&
                             op.CreatedAt.HasValue &&
                             op.CreatedAt.Value >= startOfMonth &&
                             op.CreatedAt.Value < endOfMonth)
                .Sum(op => op.Profit);

            // Tính tổng lợi nhuận của tháng trước
            var previousMonthStart = startOfMonth.AddMonths(-1);
            var previousMonthEnd = startOfMonth;

            var previousMonthProfit = db.OrderProduct
                .Where(op => op.DeletedAt == null &&
                             op.CreatedAt.HasValue &&
                             op.CreatedAt.Value >= previousMonthStart &&
                             op.CreatedAt.Value < previousMonthEnd)
                .Sum(op => op.Profit);

            // Tính tỷ lệ tăng trưởng
            double growthRate = previousMonthProfit > 0
                ? ((currentMonthProfit - previousMonthProfit) / previousMonthProfit) * 100
                : (currentMonthProfit > 0 ? 100 : 0); // Nếu không có lợi nhuận tháng trước thì coi là 100%

            // Chuẩn bị kết quả trả về
            var result = new
            {
                CurrentMonthProfit = currentMonthProfit,
                PreviousMonthProfit = previousMonthProfit,
                GrowthRatePercentage = growthRate
            };

            return Ok(new { data = result });
        }
        [HttpGet("TopSellingProducts")]
        // [Authorize]
        public IActionResult GetTopSellingProducts()
        {
            // Lấy tổng số lượng sản phẩm đã bán
            var totalQuantitySold = db.OrderProduct
                .Where(op => op.DeletedAt == null)
                .Sum(op => op.Quantity);

            // Lấy top 6 sản phẩm bán chạy nhất
            var topSellingProducts = db.OrderProduct
                .Where(op => op.DeletedAt == null)
                .GroupBy(op => op.ProductId)
                .Select(g => new
                {
                    ProductId = g.Key,
                    TotalQuantitySold = g.Sum(op => op.Quantity),
                    ProductInfo = db.Product
                        .Where(p => p.Id == g.Key)
                        .Select(p => new
                        {
                            p.Id,
                            p.Name,
                            p.SellPrice,
                            p.ImageThumbPath,
                            CompanyName = db.CompanyPartner
                                .Where(c => c.Id == p.CompanyPartnerId)
                                .Select(c => c.Name)
                                .FirstOrDefault()
                        })
                        .FirstOrDefault()
                })
                .OrderByDescending(x => x.TotalQuantitySold)
                .Take(6)
                .ToList();

            // Nếu không có sản phẩm nào bán được, trả về dữ liệu rỗng
            if (!topSellingProducts.Any())
            {
                return Ok(new { data = new object[] { }, message = "No products sold." });
            }

            // Tính phần trăm của mỗi sản phẩm so với tổng lượng đơn
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
                    p.ProductInfo.ImageThumbPath,

                    CompanyName = p.ProductInfo.CompanyName
                }
            }).ToList();

            return Ok(new { data = topSellingProductsWithPercentage });
        }

    }




}
