﻿using System.ComponentModel.DataAnnotations;

namespace AuthenticationJWT.Models;

public class Feedback
{
    [Key]
    public int Id { get; set; }
    [Required]
    public int ProductId { get; set; }
    public int ParentId { get; set; }

    public string? Content { get; set; }
    public int Version { get; set; }

    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdateAt { get; set; }
    public int CreatedBy { get; set; }
    public int UpdatedBy { get; set; }

    public DateTime? DeletedAt { get; set; }

    public Feedback()
    {
        CreatedBy = 0;
        UpdatedBy = 0;
    }
}
