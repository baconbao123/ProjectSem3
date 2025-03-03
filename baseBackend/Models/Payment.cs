﻿using System.ComponentModel.DataAnnotations;

namespace AuthenticationJWT.Models;

public class Payment
{
    [Key]
    public int Id { get; set; }
    [Required]
    public string Name { get; set; }
    public int Status { get; set; }
    public int Version { get; set; }

    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdateAt { get; set; }
    public int CreatedBy { get; set; }
    public int UpdatedBy { get; set; }

    public DateTime? DeletedAt { get; set; }

    public Payment()
    {
        CreatedBy = 0;
        UpdatedBy = 0;
    }
}
