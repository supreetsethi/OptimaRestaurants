﻿namespace webapi.DTOs.Request
{
    public class ResponceToRequestDto
    {
        public string RequestId { get; set; }
        public string RestaurantId { get; set; }
        public bool Confirmed { get; set; }
    }
}
