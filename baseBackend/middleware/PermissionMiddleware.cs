namespace AuthenticationJWT.middleware;

public class PermissionMiddleware
{
    private readonly RequestDelegate _next;
    public PermissionMiddleware(RequestDelegate next)
    {
        _next = next;
    }
    public async Task InvokeAsync(HttpContext context, MyContext db)
    {
        // Lấy thông tin người dùng từ claims
        var userId = context.User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;
        var path = context.Request.Path;
        if (userId == "1")
        {
            await _next(context);
            return;
        }
        if (userId != null)
        {
            var resource = "";
            var action = "";

            if (path.StartsWithSegments("/api/User") || path.StartsWithSegments("/api/User"))
            {
                resource = "User";
                action = getAction(context.Request.Method);
            }

            if (path.StartsWithSegments("/api/Role") || path.StartsWithSegments("/api/Role"))
            {
                resource = "Role";
                action = getAction(context.Request.Method);
            }

            if (path.StartsWithSegments("/api/Permission") || path.StartsWithSegments("/api/Permission"))
            {
                resource = "Permission";
                action = getAction(context.Request.Method);
            }
            if (path.StartsWithSegments("/api/Product") || path.StartsWithSegments("/api/Product"))
            {
                resource = "Product";
                action = getAction(context.Request.Method);
            }
            if (path.StartsWithSegments("/api/Sale") || path.StartsWithSegments("/api/Sale"))
            {
                resource = "Sale";
                action = getAction(context.Request.Method);
            }
            if (path.StartsWithSegments("/api/Category") || path.StartsWithSegments("/api/Category"))
            {
                resource = "Category";
                action = getAction(context.Request.Method);
            }
            if (path.StartsWithSegments("/api/Author") || path.StartsWithSegments("/api/Author"))
            {
                resource = "Author";
                action = getAction(context.Request.Method);
            }
            if (path.StartsWithSegments("/api/CompanyPartner") || path.StartsWithSegments("/api/CompanyPartner"))
            {
                resource = "CompanyPartner";
                action = getAction(context.Request.Method);
            }
            if (resource == "" || action == "")
            {
                await _next(context);
                return;
            }

            var hasPermission = (from u in db.User
                                 join map in db.MapRole on u.Id equals map.UserId
                                 join role in db.Role on map.RoleId equals role.Id
                                 join ma in db.MapAction on role.Id equals ma.RoleId
                                 join res in db.Resource on ma.ResourceId equals res.Id
                                 join ac in db.Action on ma.ActionId equals ac.Id
                                 where res.Name == resource && ac.Name == action
                                 && u.Id == int.Parse(userId)
                                 && res.DeletedAt == null && ac.DeletedAt == null && map.DeletedAt == null && ma.DeletedAt == null
                                 select new { u.Id }).Any();

            if (!hasPermission)
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                await context.Response.WriteAsync("Forbidden: You do not have permission to access this resource.");
                return;
            }
        }

        await _next(context);
    }
    public string getAction(string method)
    {
        if (HttpMethods.IsGet(method))
        {
            return "read";
        }
        if (HttpMethods.IsPost(method))
        {
            return "create";
        }
        if (HttpMethods.IsPut(method))
        {
            return "update";
        }
        if (HttpMethods.IsDelete(method))
        {
            return "delete";
        }
        return "";

    }
}
