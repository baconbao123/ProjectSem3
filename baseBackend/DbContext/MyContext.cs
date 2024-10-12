using AuthenticationJWT.Models;
using Microsoft.EntityFrameworkCore;


public class MyContext : DbContext
{
    public MyContext(DbContextOptions<MyContext> options) : base(options)
    {

    }
    public DbSet<User> User { get; set; }
    public DbSet<AuthenticationJWT.Models.Action> Action { get; set; }
    public DbSet<Resource> Resource { get; set; }
    public DbSet<MapAction> MapAction { get; set; }
    public DbSet<Role> Role { get; set; }
    public DbSet<MapRole> MapRole { get; set; }
    public DbSet<Product> Product { get; set; }
    public DbSet<ProductImage> ProductImage { get; set; }
    public DbSet<Category> Category { get; set; }
    public DbSet<Author> Author { get; set; }
    public DbSet<AuthorProduct> AuthorProduct { get; set; }
    public DbSet<ProductCategory> ProductCategory { get; set; }
    public DbSet<Delivery> Delivery { get; set; }
    public DbSet<Payment> Payment { get; set; }
    public DbSet<Common> Common { get; set; }

    public DbSet<UserAddress> UserAddress { get; set; }
    public DbSet<Sale> Sale { get; set; }
    public DbSet<UserSale> UserSale { get; set; }
    public DbSet<ProductSale> ProductSale { get; set; }

    public DbSet<Orders> Orders { get; set; }
    public DbSet<OrderProduct> OrderProduct { get; set; }

    public DbSet<OrderSale> OrderSale { get; set; }
    public DbSet<Feedback> Feedback { get; set; }
    public DbSet<FAQ> FAQ { get; set; }
    public DbSet<MapManu> MapManu { get; set; }
    public DbSet<MapPublish> MapPublish { get; set; }
    public DbSet<CompanyPartner> CompanyPartner { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<AuthenticationJWT.Models.Action>().HasData(
            new AuthenticationJWT.Models.Action { Id = 1, Name = "create", Version = 0, CreatedAt = DateTime.Now, UpdateAt = DateTime.Now, CreatedBy = 1, UpdatedBy = 1 },
            new AuthenticationJWT.Models.Action { Id = 2, Name = "update", Version = 0, CreatedAt = DateTime.Now, UpdateAt = DateTime.Now, CreatedBy = 1, UpdatedBy = 1 },
            new AuthenticationJWT.Models.Action { Id = 3, Name = "read", Version = 0, CreatedAt = DateTime.Now, UpdateAt = DateTime.Now, CreatedBy = 1, UpdatedBy = 1 },
            new AuthenticationJWT.Models.Action { Id = 4, Name = "delete", Version = 0, CreatedAt = DateTime.Now, UpdateAt = DateTime.Now, CreatedBy = 1, UpdatedBy = 1 }
            );
        builder.Entity<Resource>().HasData(
           new Resource { Id = 1, Name = "Admin", Version = 0, Status = 1, CreatedAt = DateTime.Now, UpdateAt = DateTime.Now, CreatedBy = 1, UpdatedBy = 1 },
           new Resource { Id = 2, Name = "User", Version = 0, Status = 1, CreatedAt = DateTime.Now, UpdateAt = DateTime.Now, CreatedBy = 1, UpdatedBy = 1 },
           new Resource { Id = 3, Name = "Product", Version = 0, Status = 1, CreatedAt = DateTime.Now, UpdateAt = DateTime.Now, CreatedBy = 1, UpdatedBy = 1 },
           new Resource { Id = 4, Name = "Resource", Version = 0, Status = 1, CreatedAt = DateTime.Now, UpdateAt = DateTime.Now, CreatedBy = 1, UpdatedBy = 1 },
           new Resource { Id = 5, Name = "Role", Version = 0, Status = 1, CreatedAt = DateTime.Now, UpdateAt = DateTime.Now, CreatedBy = 1, UpdatedBy = 1 },
           new Resource { Id = 6, Name = "Sale", Version = 0, Status = 1, CreatedAt = DateTime.Now, UpdateAt = DateTime.Now, CreatedBy = 1, UpdatedBy = 1 },
           new Resource { Id = 7, Name = "Guest", Version = 0, Status = 1, CreatedAt = DateTime.Now, UpdateAt = DateTime.Now, CreatedBy = 1, UpdatedBy = 1 }
           );
        builder.Entity<User>().HasData(
         new User
         {
             Id = 1,
             Username = "SA",
             Email = "SA",
             Password = "$2a$11$JMz6ct.S/0IsA0cr7u22fOyBOHXBG2u68Aa9Q6xgGJQtPoVft/YGK",
             Version = 0,
             Status = 1,
             CreatedAt = DateTime.Now,
             UpdateAt = DateTime.Now
         }
         );
    }

}
