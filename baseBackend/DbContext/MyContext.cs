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



}
