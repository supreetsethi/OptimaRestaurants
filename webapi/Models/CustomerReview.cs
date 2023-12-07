﻿using System.ComponentModel.DataAnnotations;

namespace webapi.Models
{
    public class CustomerReview
    {
        [Key]
        public Guid Id { get; set; }
        public virtual required Employee Employee { get; set; }
        public virtual required Restaurant Restaurant { get; set; }
        public required DateTime DateTime { get; set; }
        public string? Comment { get; set; }
        public decimal? SpeedRating { get; set; }
        public decimal? AttitudeRating { get; set; }
        public decimal? CuisineRating { get; set; }
        public decimal? AtmosphereRating { get; set; }
    }
}
