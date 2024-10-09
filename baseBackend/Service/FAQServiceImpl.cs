using AuthenticationJWT.DTO;
using AuthenticationJWT.Models;
using AutoMapper;

namespace AuthenticationJWT.Service
{
    public class FAQServiceImpl : FAQService
    {
        private readonly MyContext context;
        private readonly IMapper mapper;

        public FAQServiceImpl(MyContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public bool DeleteFAQ(int id)
        {
            var faq = context.FAQ.Find(id);
            if (faq == null)
            {
                return false; // FAQ not found
            }

            // Mark the FAQ as deleted
            faq.DeletedAt = DateTime.Now;

            // Update the context with the modified entity
            context.FAQ.Update(faq);

            // Save changes and return whether the operation was successful
            return context.SaveChanges() > 0; // Return true if the update was successful
        }


        public FAQDTO GetFAQById(int id)
        {
            var faq = context.FAQ.Find(id);
            if (faq == null || faq.DeletedAt != null) // Check if FAQ is not found or is deleted
            {
                return null; // Return null if not found or deleted
            }

            // Map FAQ entity to FAQDTO and return it
            return mapper.Map<FAQDTO>(faq);
        }

        public List<FAQDTO> GetFAQs()
        {
            var faqs = context.FAQ
                             .Where(f => f.DeletedAt == null)
                             .OrderByDescending(f => f.CreatedAt)
                             .ToList();


            return mapper.Map<List<FAQDTO>>(faqs);
        }


        public bool PostFAQs(IEnumerable<FAQDTO> faqDTOs)
        {
            var faqs = mapper.Map<IEnumerable<FAQ>>(faqDTOs);

            foreach (var faq in faqs)
            {
                faq.Version = 0; // Set default version
                faq.CreatedAt = DateTime.Now;
                faq.UpdateAt = DateTime.Now;
                context.FAQ.Add(faq);
            }

            return context.SaveChanges() > 0;
        }

        public bool PutFAQ(FAQDTO faqDTO, int id)
        {
            var existingFAQ = context.FAQ.Find(id);
            if (existingFAQ == null)
            {
                return false; // FAQ not found
            }

            // Map updated values from DTO to the existing FAQ
            mapper.Map(faqDTO, existingFAQ);
            existingFAQ.UpdateAt = DateTime.Now; // Update timestamp

            return context.SaveChanges() > 0; // Return true if update was successful
        }


    }
}