using Microsoft.AspNetCore.Mvc;

namespace AuthenticationJWT.Controllers;
public class MyBaseController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}
