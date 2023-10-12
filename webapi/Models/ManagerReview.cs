﻿using System.ComponentModel.DataAnnotations;

namespace webapi.Models
{
    public class ManagerReview
    {
        [Key]
        public Guid Id { get; set; }
        public virtual required Employee Employee { get; set; }
        public virtual required Manager Employer { get; set; }
        public required DateTime DateTime { get; set; }
        public string Comment { get; set; }
        public decimal PunctualityRating { get; set; }
        public decimal CollegialityRating { get; set; }
    }
}