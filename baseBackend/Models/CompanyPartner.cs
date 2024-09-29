using System.ComponentModel.DataAnnotations;

namespace AuthenticationJWT.Models
{
    public class CompanyPartner
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string? Email { get; set; }

        public string Address { get; set; }
        public string? Phone { get; set; }

        public string Type { get; set; }
        public int Version { get; set; }
        public int Status { get; set; }


        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdateAt { get; set; }
        public int CreatedBy { get; set; }
        public int UpdatedBy { get; set; }

        public DateTime? DeletedAt { get; set; }

        public CompanyPartner()
        {
            CreatedBy = 0;
            UpdatedBy = 0;
        }
    }
}
