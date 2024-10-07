using AuthenticationJWT.DTO;
using AuthenticationJWT.Models;
using AutoMapper;


namespace AuthenticationJWT.Service;

public class FAQServiceImpl : FAQService
{
    private MyContext context;
    private IMapper mapper;

    public FAQServiceImpl(MyContext context, IMapper mapper)
    {
        this.context = context;
        this.mapper = mapper;
    }

    public List<FAQDTO> GetFAQs()
    {
        return mapper.Map<List<FAQDTO>>(context.FAQ.ToList());
    }

    public bool PostFAQ(FAQDTO faqDTO)
    {
        var faq = mapper.Map<FAQ>(faqDTO);
        faq.CreatedAt = DateTime.Now;
        faq.UpdateAt = DateTime.Now;
        context.FAQ.Add(faq);
        return context.SaveChanges() > 0;
    }
}
