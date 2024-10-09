using AuthenticationJWT.DTO;
using AuthenticationJWT.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuthenticationJWT.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FAQController : ControllerBase
    {
        private readonly FAQService _faqService;

        public FAQController(FAQService faqService)
        {
            _faqService = faqService;
        }

        // GET: api/faq
        [HttpGet]
        public ActionResult<List<FAQDTO>> GetFAQs()
        {
            var faqs = _faqService.GetFAQs();
            return Ok(faqs);
        }

        // POST: api/faq
        [HttpPost]
        public IActionResult PostAllFAQs([FromBody] IEnumerable<FAQDTO> faqDTOs)
        {
            try
            {
                if (_faqService.PostFAQs(faqDTOs))
                {
                    return Ok("FAQs added successfully.");
                }
                return BadRequest("Failed to add FAQs.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET: api/faq/{id}
        [HttpGet("{id}")]
        public ActionResult<FAQDTO> GetFAQById(int id)
        {
            var faq = _faqService.GetFAQById(id);
            if (faq == null)
            {
                return NotFound($"FAQ with ID {id} not found.");
            }
            return Ok(faq);
        }

        // PUT: api/faq/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateFAQ(int id, [FromBody] FAQDTO faqDTO)
        {
            try
            {
                if (_faqService.PutFAQ(faqDTO, id))
                {
                    return Ok("FAQ updated successfully.");
                }
                return BadRequest("Failed to update FAQ.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/faq/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteFAQ(int id)
        {
            try
            {
                // Check if the FAQ exists before trying to delete
                var faq = _faqService.GetFAQById(id);
                if (faq == null)
                {
                    return NotFound($"FAQ with ID {id} not found.");
                }

                // Attempt to delete the FAQ
                if (_faqService.DeleteFAQ(id))
                {
                    return Ok("FAQ deleted successfully.");
                }

                return BadRequest("Failed to delete the FAQ due to an unknown reason.");
            }
            catch (DbUpdateException dbEx)
            {

                return BadRequest("An error occurred while deleting the FAQ. Please try again.");
            }
            catch (Exception ex)
            {

                return BadRequest("An unexpected error occurred. Please try again.");
            }
        }

    }
}