
using AuthenticationJWT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AuthenticationJWT.Controllers;
[Route("api/[controller]")]
[ApiController]
public class CompanyPartnerController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private MyContext db;
    public CompanyPartnerController(IConfiguration configuration, MyContext myContext)
    {
        _configuration = configuration;
        db = myContext;
    }
    // GET: api/<CompanyPartnerController>
    [HttpGet]
    [Authorize]
    public IActionResult get()
    {
        var listData = (from item in db.CompanyPartner
                        where item.DeletedAt == null
                        orderby item.CreatedAt descending
                        select item).ToList();

        return Ok(new { data = listData, total = listData.Count() });
    }

    // GET api/<CompanyPartnerController>/5
    [Authorize]
    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        var partner = (from r in db.CompanyPartner
                       join u in db.User on r.CreatedBy equals u.Id
                       join u2 in db.User on r.UpdatedBy equals u2.Id
                       where r.Id == id && r.DeletedAt == null
                       select new
                       {
                           CompanyPartner = r,
                           UserUpdated = u2.Username,
                           CreatedUpdated = u.Username,
                       }).FirstOrDefault();

        if (partner == null)
        {
            return BadRequest(new { message = "Data not found" });
        }
        return Ok(new { data = partner });
    }

    // POST api/<CompanyPartnerController>
    [HttpPost]
    [Authorize]
    public IActionResult Post([FromBody] List<CompanyPartnerRequest> requests)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;

        var partners = new List<CompanyPartner>();
        var existingEmails = db.CompanyPartner
                              .Where(cp => requests.Select(r => r.Email).Contains(cp.Email))
                              .Select(cp => cp.Email)
                              .ToList();

        foreach (var request in requests)
        {
            if (existingEmails.Contains(request.Email))
            {
                return BadRequest(new { message = $"Email {request.Email} exsist already." });
            }

            var partner = new CompanyPartner
            {
                Name = request.Name,
                Email = request.Email,
                Address = request.Address,
                Phone = request.Phone,
                Type = request.Type,
                Status = request.Status ?? 0,
                Version = 0,
                CreatedAt = DateTime.Now,
                UpdateAt = DateTime.Now,
                CreatedBy = int.Parse(userId),
                UpdatedBy = int.Parse(userId)
            };

            partners.Add(partner);
        }

        db.CompanyPartner.AddRange(partners);
        db.SaveChanges();
        return Ok(new { data = partners });
    }



    // PUT api/<CompanyPartnerController>/5
    [Authorize]
    [HttpPut("{id}")]
    public IActionResult Put(int id, [FromBody] CompanyPartnerRequest request)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;

        var partner = db.CompanyPartner.FirstOrDefault(c => c.Id == id && c.DeletedAt == null);
        if (partner == null)
        {
            return BadRequest(new { message = "Data not found" });
        }
        if (partner.Version != request.Version)
        {
            return BadRequest(new { type = "reload", message = "Data has change pls reload" });
        }
        partner.Name = request.Name;
        partner.Email = request.Email;
        partner.Address = request.Address;
        partner.Phone = request.Phone;
        partner.Type = request.Type;
        partner.Status = request.Status ?? 0;
        partner.Version = request.Version + 1;
        partner.UpdateAt = DateTime.Now;
        partner.UpdatedBy = int.Parse(userId);
        partner.CreatedBy = int.Parse(userId);
        db.SaveChanges();
        return Ok(new { data = partner });
    }

    // DELETE api/<CompanyPartnerController>/5'
    [Authorize]
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == "Myapp_User_Id")?.Value;
        var partner = db.CompanyPartner.FirstOrDefault(c => c.Id == id && c.DeletedAt == null);
        if (partner == null)
        {
            return BadRequest(new { message = "Data not found" });
        }
        partner.DeletedAt = DateTime.Now;
        partner.UpdatedBy = int.Parse(userId);
        db.SaveChanges();
        return Ok(new { data = partner });

    }
}
