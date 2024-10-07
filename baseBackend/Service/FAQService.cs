using AuthenticationJWT.DTO;

namespace AuthenticationJWT.Service;

public interface FAQService
{
    public List<FAQDTO> GetFAQs();
    public bool PostFAQ(FAQDTO faqDTO);
}
