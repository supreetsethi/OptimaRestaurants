﻿using System.ComponentModel.DataAnnotations;

namespace webapi.Models
{
    public class Review
    {
        [Key]
        public Guid Id { get; set; }
        public virtual required Employee Employee { get; set; }
        public virtual required Restaurant Restaurant { get; set; }
        public required DateTime DateTime { get; set; } = DateTime.Now;
        [MaxLength(300)]
        public string? Comment { get; set; }
    }
}
