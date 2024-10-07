using AuthenticationJWT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

                                // Fetch company partner name
                                CompanyPartnerName = partner.Name,
                                item.Version,
                                item.Status,
                                item.BasePrice,
                                item.SellPrice,
                                item.Quantity,
                                item.CreatedAt,
                                item.UpdateAt,

                                // Fetch categories only if active
                                Categories = (from pc in db.ProductCategory
                                              join cate in db.Category on pc.CategoryId equals cate.Id
                                              where pc.ProductId == item.Id && cate.Status == 1
                                              select new
                                              {
                                                  cate.Id,
                                                  cate.CategoryCode,
                                                  cate.Description
                                              }).ToList(),

                                // Fetch authors of the product
                                Authors = (from ap in db.AuthorProduct
                                           join author in db.Author on ap.AuthorId equals author.Id
                                           where ap.ProductId == item.Id
                                           select new
                                           {
                                               author.Name
                                           }).ToList(),

                                // Fetch images of the product
                                ProductImages = db.ProductImage
                                    .Where(pi => pi.ProductId == item.Id)
                                    .Select(pi => new
                                    {
                                        pi.ImagePath
                                    })
                                    .ToList()
                            }).ToList();

            return Ok(new { data = listData, total = listData.Count });
        }

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

                // Fetch products across the category and its child categories, ensuring no duplicates
                var products = (from pc in db.ProductCategory
                                join p in db.Product on pc.ProductId equals p.Id
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
                                }).Distinct().ToList();

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



        [Authorize]
        [HttpGet("category/{categoryId}")]
        public IActionResult GetProductByCategory(int categoryId)
        {
            var category = db.Category.FirstOrDefault(c => c.Id == categoryId && c.Status == 1);
            if (category == null)
            {
                return BadRequest(new { message = "Category not found or not active." });
            }

            var products = (from pc in db.ProductCategory
                            join p in db.Product on pc.ProductId equals p.Id
                            where pc.CategoryId == categoryId && pc.DeletedAt == null && p.DeletedAt == null
                            orderby p.CreatedAt descending
                            select new
                            {
                                p.Id,
                                p.Name,
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
                               // Lấy tên đối tác công ty
                               CompanyPartnerName = partner.Name,
                               CompanyPartnerId = partner.Id,

                               item.Status,
                               item.BasePrice,
                               item.SellPrice,
                               item.Quantity,
                               item.CreatedAt,
                               item.UpdateAt,

                               // Lấy danh sách các danh mục của sản phẩm
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

                               // Lấy danh sách hình ảnh của sản phẩm
                               ProductImages = db.ProductImage
                                   .Where(pi => pi.ProductId == item.Id)
                                   .Select(pi => new
                                   {
                                       pi.ImagePath
                                   })
                                   .ToList()
                           }).ToList();



            if (product == null)
            {
                return BadRequest(new { message = "Data not found" });
            }
            return Ok(new { data = product });
        }


        // POST: api/Product
        // POST: api/Product
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Post([FromForm] ProductRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

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
                CreatedAt = DateTime.UtcNow,
                UpdateAt = DateTime.UtcNow,
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
                    return StatusCode(500, new { message = "Error saving product.", error = ex.Message });
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

            string productNumber = productCount.ToString("D2");
            string productCode = $"{categoryCode}{manufacturerCode}{productNumber}";

            return productCode;
        }


        [Authorize]
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromForm] ProductRequest request)
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;

            // 
            var product = db.Product.FirstOrDefault(c => c.Id == id && c.DeletedAt == null);
            if (product == null)
            {
                return BadRequest(new { message = "Data not found" });
            }

            // 
            if (product.Version != request.Version)
            {
                return BadRequest(new { type = "reload", message = "Data has changed, please reload" });
            }

            // 
            //var category = db.Category.FirstOrDefault(c => c.Id == request.CategoryId);
            //if (category == null)
            //{
            //    return BadRequest(new { message = "Category not found." });
            //}

            // 
            var company = db.CompanyPartner.FirstOrDefault(c => c.Id == request.CompanyPartnerId);
            if (company == null)
            {
                return BadRequest(new { message = "Company partner not found." });
            }

            // 
            //var categoryCode = category.CategoryCode;
            var manufacturer = company.Name;
            int productCount = db.Product.Count(p => p.CompanyPartnerId == request.CompanyPartnerId) + 1;
            //var productCode = GenerateProductCode(categoryCode, manufacturer, productCount);

            // Update product
            product.Name = request.Name;
            //product.Code = productCode;
            //product.CategoryId = request.CategoryId;
            product.Description = request.Description;
            product.BasePrice = request.BasePrice;
            product.SellPrice = request.SellPrice;
            product.Status = request.Status ?? 0;
            product.Version = request.Version + 1;
            product.UpdateAt = DateTime.Now;
            product.UpdatedBy = int.Parse(userId);

            using (var transaction = db.Database.BeginTransaction())
            {
                try
                {
                    // add new author
                    var validAuthorIds = request.AuthorIds?.Where(id => id > 0).ToList();
                    if (validAuthorIds != null && validAuthorIds.Any())
                    {
                        foreach (var authorId in validAuthorIds)
                        {
                            var author = db.Author.FirstOrDefault(a => a.Id == authorId);
                            if (author == null)
                            {
                                return BadRequest(new { message = $"Author with Id {authorId} not found." });
                            }


                            var productAuthorExists = db.AuthorProduct.Any(ap => ap.ProductId == product.Id && ap.AuthorId == authorId);
                            if (!productAuthorExists)
                            {

                                db.AuthorProduct.Add(new AuthorProduct
                                {
                                    ProductId = product.Id,
                                    AuthorId = author.Id,
                                    CreatedAt = DateTime.UtcNow,
                                    UpdateAt = DateTime.UtcNow,
                                    UpdatedBy = int.Parse(userId)
                                });
                            }
                        }

                        db.SaveChanges();
                    }


                    var existingImages = db.ProductImage.Where(pi => pi.ProductId == id).ToList();
                    if (existingImages.Any())
                    {
                        foreach (var image in existingImages)
                        {
                            var imagePath = Path.Combine(_environment.WebRootPath, image.ImagePath);
                            if (System.IO.File.Exists(imagePath))
                            {
                                System.IO.File.Delete(imagePath); // Delete file 
                            }
                            db.ProductImage.Remove(image); //
                        }
                        db.SaveChanges();
                    }

                    // add new img
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
                                    imageFile.CopyTo(stream);
                                }

                                var productImage = new ProductImage
                                {
                                    ProductId = product.Id,
                                    ImagePath = Path.Combine("uploads", "products", fileName),
                                    CreatedAt = DateTime.UtcNow,
                                    UpdatedBy = int.Parse(userId)
                                };

                                db.ProductImage.Add(productImage);
                            }
                        }

                        db.SaveChanges();
                    }

                    db.SaveChanges();
                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    transaction.Rollback(); // Return if error
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
