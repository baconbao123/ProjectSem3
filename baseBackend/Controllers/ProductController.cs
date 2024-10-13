using AuthenticationJWT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Text;

namespace AuthenticationJWT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly MyContext db;
        private readonly IWebHostEnvironment _environment;

        public ProductController(IConfiguration configuration, MyContext context, IWebHostEnvironment environment)
        {
            _configuration = configuration;
            db = context;
            _environment = environment;
        }
        // GET: api/<CompanyProductController>
        [HttpGet]
        [Authorize]
        public IActionResult Get()
        {
            // Fetch product list with additional conditions for active categories
            var listData = (from item in db.Product
                            join partner in db.CompanyPartner on item.CompanyPartnerId equals partner.Id
                            where item.DeletedAt == null && item.Status == 1
                                  && !db.ProductCategory.Any(pc => pc.ProductId == item.Id
                                                                    && db.Category.Any(c => c.Id == pc.CategoryId && c.Status != 1))
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
                                //Categories = (from pc in db.ProductCategory
                                //              join cate in db.Category on pc.CategoryId equals cate.Id
                                //              where pc.ProductId == item.Id && cate.Status == 1
                                //              select new
                                //              {
                                //                  cate.Id,
                                //                  cate.CategoryCode,
                                //                  cate.Description
                                //              }).ToList(),

                                //// Fetch authors of the product
                                //Authors = (from ap in db.AuthorProduct
                                //           join author in db.Author on ap.AuthorId equals author.Id
                                //           where ap.ProductId == item.Id
                                //           select new
                                //           {
                                //               author.Name
                                //           }).ToList(),


                            }).ToList();

            return Ok(new { data = listData, total = listData.Count });
        }

        // get products with category
        // get products with category
        [Authorize]
        [HttpGet("category")]
        public IActionResult GetAllCategoriesWithProducts()
        {
            // Fetch all active categories (both parent and child) that are not deleted
            var categories = db.Category
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



        [Authorize]
        [HttpGet("category/{categoryId}")]
        public IActionResult GetProductByCategory(int categoryId)
        {
            var category = db.Category.FirstOrDefault(c => c.Id == categoryId && c.Status == 1);
            if (category == null)
            {
                return BadRequest(new { message = "Category not found or not active." });
            }

            // Kiểm tra xem category có phải là category cha không
            var isParentCategory = db.Category.Any(c => c.ParentId == categoryId);

            List<int> categoryIdsToSearch;

            if (isParentCategory)
            {
                // Nếu là category cha, lấy tất cả category con
                categoryIdsToSearch = db.Category
                    .Where(c => c.ParentId == categoryId && c.Status == 1)
                    .Select(c => c.Id)
                    .ToList();
            }
            else
            {
                // Nếu không, chỉ lấy category hiện tại
                categoryIdsToSearch = new List<int> { categoryId };
            }

            var products = (from pc in db.ProductCategory
                            join p in db.Product on pc.ProductId equals p.Id
                            where categoryIdsToSearch.Contains(pc.CategoryId) && pc.DeletedAt == null && p.DeletedAt == null
                            orderby p.CreatedAt descending
                            select new
                            {
                                p.Id,
                                p.Name,
                                p.ImageThumbPath,
                                p.Code,
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



        // GET api/<ProductController>/5
        [Authorize]
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {

            var product = (from item in db.Product
                           join partner in db.CompanyPartner on item.CompanyPartnerId equals partner.Id
                           join u in db.User on item.UpdatedBy equals u.Id
                           join u2 in db.User on item.CreatedBy equals u2.Id
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
                               Categories = (from pc in db.ProductCategory
                                             join cate in db.Category on pc.CategoryId equals cate.Id
                                             where pc.ProductId == item.Id && cate.Status == 1
                                             select new
                                             {
                                                 cate.Id,
                                                 cate.Name,
                                                 cate.CategoryCode,
                                                 cate.Description
                                             }).ToList(),

                               // Lấy danh sách tác giả của sản phẩm
                               Authors = (from ap in db.AuthorProduct
                                          join author in db.Author on ap.AuthorId equals author.Id
                                          where ap.ProductId == item.Id
                                          select new
                                          {
                                              author.Id,
                                              author.Name
                                          }).ToList(),

                               ProductImages = db.ProductImage
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


        // POST: api/Product
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Post([FromForm] ProductRequest request)
        {
            //if (!ModelState.IsValid)
            //{
            //    return BadRequest(ModelState);
            //}

            if (string.IsNullOrWhiteSpace(request.Name))
            {
                return BadRequest(new { message = "Product name is required." });
            }

            if (string.IsNullOrWhiteSpace(request.Description))
            {
                return BadRequest(new { message = "Product description is required." });
            }

            var validCategoryIds = request.CategoryIds?.Where(id => id > 0).ToList();
            if (validCategoryIds == null || !validCategoryIds.Any())
            {
                return BadRequest(new { message = "At least one category is required." });
            }

            if (request.ProductImages == null || !request.ProductImages.Any())
            {
                return BadRequest(new { message = "At least one product image is required." });
            }

            var company = db.CompanyPartner.FirstOrDefault(c => c.Id == request.CompanyPartnerId);
            if (company == null)
            {
                return BadRequest(new { message = "Company partner not found." });
            }

            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;
            if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "User not authenticated." });
            }

            // Tìm danh mục cha có level = 0
            var parentCategory = db.Category.FirstOrDefault(c =>
                validCategoryIds.Contains(c.Id) && c.Level == 0)
                ?? db.Category.FirstOrDefault(pc =>
                    pc.Level == 0 && db.Category.Any(sub => validCategoryIds.Contains(sub.Id) && sub.ParentId == pc.Id));

            if (parentCategory == null)
            {
                return BadRequest(new { message = "No parent category with level 0 found for the provided subcategories." });
            }

            var categoryCode = parentCategory.CategoryCode;
            var manufacturer = company.Name;
            int productCount = db.Product.Count(p => p.CompanyPartnerId == request.CompanyPartnerId) + 1;

            var productCode = GenerateProductCode(categoryCode, manufacturer, productCount);

            // Upload ảnh thumbnail
            string imageFileName1 = await UploadThumbnailAsync(request.ImageThumbPath, "thumbProduct");
            if (imageFileName1 == null)
            {
                return BadRequest(new { message = "Error uploading thumbnail image." });
            }

            // Tạo sản phẩm
            var product = new Product
            {
                Name = request.Name,
                Description = request.Description,
                Code = productCode,
                Profit = (float?)(request.SellPrice - request.BasePrice),
                BasePrice = request.BasePrice,
                SellPrice = request.SellPrice,
                Quantity = request.Quantity,
                CompanyPartnerId = request.CompanyPartnerId,
                ImageThumbPath = Path.Combine("uploads", "thumbProduct", imageFileName1).Replace("\\", "/"),
                Status = request.Status ?? 0,
                Version = 0,
                CreatedAt = DateTime.Now,
                UpdateAt = DateTime.Now,
                CreatedBy = userId,
                UpdatedBy = userId
            };

            using (var transaction = db.Database.BeginTransaction())
            {
                try
                {
                    db.Product.Add(product);
                    db.SaveChanges();

                    await AddProductCategoriesAsync(product.Id, validCategoryIds, userId);
                    await AddProductAuthorsAsync(product.Id, request.AuthorIds, userId);
                    await UploadProductImagesAsync(product.Id, request.ProductImages, userId);

                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return StatusCode(500, new
                    {
                        message = "Error saving product.",
                        error = ex.InnerException?.Message ?? ex.Message
                    });
                }
            }

            return Ok(new { data = product });
        }

        // Phương thức upload thumbnail
        private async Task<string> UploadThumbnailAsync(IFormFile file, string folderName)
        {
            var validExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            var uploadsPath = Path.Combine(_environment.WebRootPath, "uploads", folderName);

            if (!Directory.Exists(uploadsPath))
            {
                Directory.CreateDirectory(uploadsPath);
            }

            if (file != null)
            {
                var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (validExtensions.Contains(fileExtension))
                {
                    var fileName = $"{Guid.NewGuid()}{fileExtension}";
                    var filePath = Path.Combine(uploadsPath, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    return fileName;
                }
            }

            return null;
        }

        // Phương thức thêm danh mục sản phẩm
        private async Task AddProductCategoriesAsync(int productId, List<int> categoryIds, int userId)
        {
            foreach (var categoryId in categoryIds)
            {
                var category = db.Category.FirstOrDefault(c => c.Id == categoryId);
                if (category == null)
                {
                    throw new Exception($"Category with Id {categoryId} not found.");
                }

                var productCategory = new ProductCategory
                {
                    ProductId = productId,
                    CategoryId = category.Id,
                    CreatedAt = DateTime.UtcNow,
                    UpdateAt = DateTime.UtcNow,
                    UpdatedBy = userId,
                    CreatedBy = userId
                };

                db.ProductCategory.Add(productCategory);
            }

            await db.SaveChangesAsync();
        }

        // Phương thức thêm tác giả cho sản phẩm
        private async Task AddProductAuthorsAsync(int productId, List<int> authorIds, int userId)
        {
            if (authorIds != null && authorIds.Any())
            {
                foreach (var authorId in authorIds)
                {
                    var author = db.Author.FirstOrDefault(a => a.Id == authorId);
                    if (author == null)
                    {
                        throw new Exception($"Author with Id {authorId} not found.");
                    }

                    var productAuthor = new AuthorProduct
                    {
                        ProductId = productId,
                        AuthorId = author.Id,
                        CreatedAt = DateTime.UtcNow,
                        UpdateAt = DateTime.UtcNow,
                        UpdatedBy = userId,
                        CreatedBy = userId
                    };

                    db.AuthorProduct.Add(productAuthor);
                }

                await db.SaveChangesAsync();
            }
        }

        // Phương thức upload hình ảnh sản phẩm
        private async Task UploadProductImagesAsync(int productId, IEnumerable<IFormFile> productImages, int userId)
        {
            var validExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            var uploadsPath = Path.Combine(_environment.WebRootPath, "uploads", "products");

            if (!Directory.Exists(uploadsPath))
            {
                Directory.CreateDirectory(uploadsPath);
            }

            foreach (var imageFile in productImages)
            {
                var fileExtension = Path.GetExtension(imageFile.FileName).ToLowerInvariant();
                if (validExtensions.Contains(fileExtension))
                {
                    var fileName = $"{Guid.NewGuid()}{fileExtension}";
                    var filePath = Path.Combine(uploadsPath, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await imageFile.CopyToAsync(stream);
                    }

                    var productImage = new ProductImage
                    {
                        ProductId = productId,
                        ImagePath = Path.Combine("uploads", "products", fileName).Replace("\\", "/"),
                        CreatedBy = userId,
                        CreatedAt = DateTime.UtcNow,
                        UpdateAt = DateTime.UtcNow,
                        UpdatedBy = userId
                    };

                    db.ProductImage.Add(productImage);
                }
            }

            await db.SaveChangesAsync();
        }
        private string GenerateProductCode(string categoryCode, string manufacturer, int productCount)
        {
            string manufacturerCode = manufacturer.Length >= 3 ?
                                      manufacturer.Substring(0, 3).ToUpper() :
                                      manufacturer.ToUpper().PadRight(3, '0');
            string normalizedString = RemoveDiacritics(manufacturerCode);

            string productNumber = productCount.ToString("D2");
            string productCode = $"{categoryCode}{normalizedString}{productNumber}";

            // Ensure the generated code is unique
            while (db.Product.Any(p => p.Code == productCode))
            {
                productCount++;
                productNumber = productCount.ToString("D2");
                productCode = $"{categoryCode}{manufacturerCode}{productNumber}";
            }

            return productCode;
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

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromForm] ProductRequest request)
        {
            // Lấy userId từ claims
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Invalid user." });
            }

            // Tìm sản phẩm cần cập nhật
            var product = await db.Product.FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null);
            if (product == null)
            {
                return BadRequest(new { message = "Data not found" });
            }

            // Kiểm tra phiên bản để đảm bảo tính đồng bộ
            if (product.Version != request.Version)
            {
                return BadRequest(new { type = "reload", message = "Data has changed, please reload" });
            }

            // Kiểm tra CompanyPartnerId
            var company = await db.CompanyPartner.FirstOrDefaultAsync(c => c.Id == request.CompanyPartnerId);
            if (company == null)
            {
                return BadRequest(new { message = "Company partner not found." });
            }
            var validCategoryIds = request.CategoryIds?.Where(id => id > 0).ToList();
            if (validCategoryIds == null || !validCategoryIds.Any())
            {
                return BadRequest(new { message = "At least one category is required." });
            }
            // Tìm danh mục cha có level = 0
            var parentCategory = db.Category.FirstOrDefault(c =>
                validCategoryIds.Contains(c.Id) && c.Level == 0)
                ?? db.Category.FirstOrDefault(pc =>
                    pc.Level == 0 && db.Category.Any(sub => validCategoryIds.Contains(sub.Id) && sub.ParentId == pc.Id));

            if (parentCategory == null)
            {
                return BadRequest(new { message = "No parent category with level 0 found for the provided subcategories." });
            }
            var categoryCode = parentCategory.CategoryCode;
            var manufacturer = company.Name;
            int productCount = db.Product.Count(p => p.CompanyPartnerId == request.CompanyPartnerId) + 1;
            // Cập nhật thông tin sản phẩm
            product.Name = request.Name;

            product.Code = GenerateProductCode(categoryCode, manufacturer, productCount);
            product.Description = request.Description;
            product.BasePrice = request.BasePrice;
            product.SellPrice = request.SellPrice;
            product.Quantity = request.Quantity;
            product.Status = request.Status ?? 0;
            product.Version += 1;
            product.UpdateAt = DateTime.Now;
            product.UpdatedBy = userId;

            using (var transaction = await db.Database.BeginTransactionAsync())
            {
                try
                {
                    // Quản lý Authors
                    if (request.AuthorIds != null)
                    {
                        // Lấy các Author hiện tại liên kết với sản phẩm
                        var existingAuthorIds = await db.AuthorProduct
                                                        .Where(ap => ap.ProductId == id)
                                                        .Select(ap => ap.AuthorId)
                                                        .ToListAsync();

                        // Các Author cần thêm
                        var newAuthorIds = request.AuthorIds.Except(existingAuthorIds).ToList();
                        foreach (var authorId in newAuthorIds)
                        {
                            var author = await db.Author.FindAsync(authorId);
                            if (author == null)
                            {
                                return BadRequest(new { message = $"Author with Id {authorId} not found." });
                            }

                            db.AuthorProduct.Add(new AuthorProduct
                            {
                                ProductId = id,
                                AuthorId = authorId,
                                CreatedAt = DateTime.Now,
                                UpdateAt = DateTime.Now,
                                UpdatedBy = userId
                            });
                        }

                        // Các Author cần xóa
                        var removeAuthorIds = existingAuthorIds.Except(request.AuthorIds).ToList();
                        foreach (var authorId in removeAuthorIds)
                        {
                            var authorProduct = await db.AuthorProduct
                                                        .FirstOrDefaultAsync(ap => ap.ProductId == id && ap.AuthorId == authorId);
                            if (authorProduct != null)
                            {
                                db.AuthorProduct.Remove(authorProduct);
                            }
                        }
                    }

                    // Quản lý Categories
                    if (request.CategoryIds != null)
                    {
                        // Lấy các Category hiện tại liên kết với sản phẩm
                        var existingCategoryIds = await db.ProductCategory
                                                            .Where(cp => cp.ProductId == id)
                                                            .Select(cp => cp.CategoryId)
                                                            .ToListAsync();

                        // Các Category cần thêm
                        var newCategoryIds = request.CategoryIds.Except(existingCategoryIds).ToList();
                        foreach (var categoryId in newCategoryIds)
                        {
                            var category = await db.Category.FindAsync(categoryId);
                            if (category == null)
                            {
                                return BadRequest(new { message = $"Category with Id {categoryId} not found." });
                            }

                            db.ProductCategory.Add(new ProductCategory
                            {
                                ProductId = id,
                                CategoryId = categoryId,
                                CreatedAt = DateTime.Now,
                                UpdateAt = DateTime.Now,
                                UpdatedBy = userId
                            });
                        }

                        // Các Category cần xóa
                        var removeCategoryIds = existingCategoryIds.Except(request.CategoryIds).ToList();
                        foreach (var categoryId in removeCategoryIds)
                        {
                            var categoryProduct = await db.ProductCategory
                                                        .FirstOrDefaultAsync(cp => cp.ProductId == id && cp.CategoryId == categoryId);
                            if (categoryProduct != null)
                            {
                                db.ProductCategory.Remove(categoryProduct);
                            }
                        }
                    }

                    //// Quản lý hình ảnh đã bị xóa
                    //if (request.DeletedImages != null && request.DeletedImages.Any())
                    //{
                    //    foreach (var imagePath in request.DeletedImages)
                    //    {
                    //        var productImage = await db.ProductImage
                    //                                    .FirstOrDefaultAsync(pi => pi.ProductId == id && pi.ImagePath.Equals(imagePath, StringComparison.OrdinalIgnoreCase));
                    //        if (productImage != null)
                    //        {
                    //            var fullPath = Path.Combine(_environment.WebRootPath, imagePath.Replace("/", Path.DirectorySeparatorChar.ToString()));
                    //            if (System.IO.File.Exists(fullPath))
                    //            {
                    //                System.IO.File.Delete(fullPath);
                    //            }
                    //            db.ProductImage.Remove(productImage);
                    //        }
                    //    }
                    //}

                    // Quản lý Thumbnail
                    if (request.ImageThumbPath != null && request.ImageThumbPath.Length > 0)
                    {
                        // Xóa thumbnail cũ nếu có
                        if (!string.IsNullOrEmpty(product.ImageThumbPath))
                        {
                            var oldThumbPath = Path.Combine(_environment.WebRootPath, product.ImageThumbPath.Replace("/", Path.DirectorySeparatorChar.ToString()));
                            if (System.IO.File.Exists(oldThumbPath))
                            {
                                System.IO.File.Delete(oldThumbPath);
                            }
                        }

                        // Lưu thumbnail mới
                        var thumbFile = request.ImageThumbPath;
                        var validThumbExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
                        var thumbExtension = Path.GetExtension(thumbFile.FileName).ToLowerInvariant();

                        if (!validThumbExtensions.Contains(thumbExtension))
                        {
                            return BadRequest(new { message = $"Invalid thumbnail file type: {thumbExtension}. Only .jpg, .jpeg, .png, and .webp are allowed." });
                        }

                        var thumbUploads = Path.Combine(_environment.WebRootPath, "uploads", "thumbProduct");
                        if (!Directory.Exists(thumbUploads))
                        {
                            Directory.CreateDirectory(thumbUploads);
                        }

                        var thumbFileName = $"{Guid.NewGuid()}{thumbExtension}";
                        var thumbFilePath = Path.Combine(thumbUploads, thumbFileName);

                        using (var stream = new FileStream(thumbFilePath, FileMode.Create))
                        {
                            await thumbFile.CopyToAsync(stream);
                        }

                        product.ImageThumbPath = Path.Combine("uploads", "thumbProduct", thumbFileName).Replace("\\", "/");
                    }

                    // Quản lý hình ảnh sản phẩm mới
                    if (request.ProductImages != null && request.ProductImages.Any())
                    {
                        foreach (var imageFile in request.ProductImages)
                        {
                            if (imageFile.Length > 0)
                            {
                                var validExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
                                var fileExtension = Path.GetExtension(imageFile.FileName).ToLowerInvariant();

                                if (!validExtensions.Contains(fileExtension))
                                {
                                    return BadRequest(new { message = $"Invalid file type: {fileExtension}. Only .jpg, .jpeg, .png, and .webp are allowed." });
                                }

                                var uploads = Path.Combine(_environment.WebRootPath, "uploads", "products");
                                if (!Directory.Exists(uploads))
                                {
                                    Directory.CreateDirectory(uploads);
                                }

                                var fileName = $"{Guid.NewGuid()}{fileExtension}";
                                var filePath = Path.Combine(uploads, fileName);

                                using (var stream = new FileStream(filePath, FileMode.Create))
                                {
                                    await imageFile.CopyToAsync(stream);
                                }

                                var productImage = new ProductImage
                                {
                                    ProductId = id,
                                    ImagePath = Path.Combine("uploads", "products", fileName).Replace("\\", "/"),
                                    CreatedAt = DateTime.Now,
                                    UpdatedBy = userId
                                };

                                db.ProductImage.Add(productImage);
                            }
                        }
                    }

                    // Lưu các thay đổi vào cơ sở dữ liệu
                    await db.SaveChangesAsync();
                    await transaction.CommitAsync();
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return StatusCode(500, new { message = "Error updating product and images.", error = ex.Message });
                }
            }

            return Ok(new { data = product });
        }

        // DELETE api/<CompanyProductController>/5'
        [Authorize]
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;
            var product = db.Product.FirstOrDefault(c => c.Id == id && c.DeletedAt == null);
            if (product == null)
            {
                return BadRequest(new { message = "Data not found" });
            }
            product.DeletedAt = DateTime.Now;
            product.Status = 0;
            product.UpdatedBy = int.Parse(userId);
            db.SaveChanges();
            return Ok(new { data = product });

        }
    }


}
