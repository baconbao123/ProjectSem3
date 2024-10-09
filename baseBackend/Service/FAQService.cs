using AuthenticationJWT.DTO;

namespace AuthenticationJWT.Service;

public interface FAQService
{
    public List<FAQDTO> GetFAQs();
    public bool PostFAQs(IEnumerable<FAQDTO> faqDTOs);
    public FAQDTO GetFAQById(int id);
    public bool PutFAQ(FAQDTO faqDTO, int id);
    public bool DeleteFAQ(int id);
}
