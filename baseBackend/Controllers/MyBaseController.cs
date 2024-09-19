using Microsoft.AspNetCore.Mvc;

namespace AuthenticationJWT.Controllers;
public class MyBaseController : ControllerBase
{
    private MyContext db;

    public MyBaseController(MyContext myContext)
    {
        db = myContext;

    }

}
