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
    public DbSet<MapAction> MapActions { get; set; }
    public DbSet<Role> Role { get; set; }
    public DbSet<MapRole> MapRoles { get; set; }

}
