﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapi.Data;
using webapi.DTOs.Request;
using webapi.DTOs.Restaurant;
using webapi.Models;

namespace webapi.Controllers
{
    /// <summary>
    /// Adds/Deletes/Edit a restaurant - pass a managers id
    /// assigns a employee to a restaurant - pass a managers id and an employee id
    /// Get restaurants by different elements
    /// </summary>
    public class RestaurantController : Controller
    {
        private readonly OptimaRestaurantContext _context;
        public RestaurantController(OptimaRestaurantContext context)
        {
            _context = context;
        }

        [HttpGet("api/restaurants")]
        public async Task<ActionResult<List<BrowseRestaurantDto>>> GetAllRestaurants()
        {
            List<BrowseRestaurantDto> restaurantsDto = new List<BrowseRestaurantDto>();
            if (_context.Restaurants == null) return BadRequest("Няма ресторанти!");

            foreach (var restaurant in await _context.Restaurants.OrderByDescending(r => r.Name).ToListAsync())
            {
                restaurantsDto.Add(new BrowseRestaurantDto
                {
                    Id = restaurant.Id.ToString(),
                    Name = restaurant.Name,
                    Address = restaurant.Address,
                    City = restaurant.City,
                    RestaurantAverageRating = restaurant?.RestaurantAverageRating ?? -1,
                    IsWorking = restaurant?.IsWorking ?? false,
                    IconUrl = restaurant?.IconUrl,
                });
            }

            return restaurantsDto;
        }

        [HttpGet("api/restaurants/restaurant-details/{restaurantId}")]
        public async Task<ActionResult<RestaurantDetailsDto>> GetRestaurantDetails(string restaurantId)
        {
            var restaurant = await _context.Restaurants.FirstOrDefaultAsync(r => r.Id.ToString() == restaurantId);
            if (restaurant == null) return BadRequest("Ресторантът не съществува!");

            var manager = restaurant.Manager;
            string managerFullName = "Ресторантът няма мениджър!";
            string managerEmail = string.Empty;
            if (manager != null) 
            { 
                managerFullName = manager.Profile.FirstName + " " + manager.Profile.LastName;
                managerEmail = manager.Profile.Email ?? string.Empty;
            }

            var topEmployee = restaurant.EmployeesRestaurants.Select(er => er.Employee).OrderBy(e => e.EmployeeAverageRating).FirstOrDefault();
            string topEmployeeFullName = "Ресторантът няма работници!";
            string topEmployeeEmail = string.Empty;
            decimal topEmployeeRating = 0;
            if (topEmployee != null)
            { 
                topEmployeeFullName = topEmployee.Profile.FirstName + " " + topEmployee.Profile.LastName; 
                topEmployeeRating = topEmployee.EmployeeAverageRating ?? 0;
                topEmployeeEmail = topEmployee.Profile.Email ?? string.Empty;
            }

            var restaurantDto = new RestaurantDetailsDto
            {
                Address = restaurant.Address,
                AtmosphereAverageRating = restaurant.AtmosphereAverageRating,
                RestaurantAverageRating = restaurant.RestaurantAverageRating,
                CuisineAverageRating = restaurant.CuisineAverageRating,
                EmployeesAverageRating = restaurant.EmployeesAverageRating,
                City = restaurant.City,
                EmployeeCapacity = restaurant.EmployeeCapacity,
                IconUrl = restaurant.IconUrl,
                IsWorking = restaurant.IsWorking,
                Name = restaurant.Name,
                Id = restaurant.Id.ToString(),
                ManagerFullName = managerFullName,
                TopEmployeeFullName = topEmployeeFullName,
                TopEmployeeRating = topEmployeeRating,
                TopEmployeeEmail = topEmployeeEmail,
                ManagerEmail = managerEmail
            };

            return restaurantDto;
        }

        [HttpPost("api/restaurants/send-working-request")]
        public async Task<IActionResult> SendWorkingRequest([FromBody] NewEmployeeRequestDto requestDto)
        {
            var restaurant = await _context.Restaurants.FirstOrDefaultAsync(r => r.Id.ToString() == requestDto.RestaurantId);
            if (restaurant == null) return BadRequest("Ресторантът не съществува!");
            if (!restaurant.IsWorking) return BadRequest("Ресторантът не работи!");
            if (restaurant.EmployeeCapacity <= _context.EmployeesRestaurants
                .Where(er => er.Restaurant.Id.ToString() == requestDto.RestaurantId).Count())
                return BadRequest("Ресторантът не наема повече работници!");


            var employee = await _context.Employees.FirstOrDefaultAsync(e => e.Profile.Email == requestDto.EmployeeEmail);
            var employeeProfile = await _context.Users.FirstOrDefaultAsync(p => p.Email == requestDto.EmployeeEmail);
            if (employee == null || employeeProfile == null) return BadRequest("Потребителят не съществува!");

            var manager = restaurant.Manager;
            if (manager == null) return BadRequest("Ресторантът няма мениджър!");
            var managerProfile = manager.Profile;

            Request request = new Request
            {
                Sender = employeeProfile,
                Restaurant = restaurant,
                SentOn = DateTime.UtcNow,
            };

            managerProfile.Requests.Add(request);
            await _context.SaveChangesAsync();
            return Ok(new JsonResult(new { title = "Успешно изпратена заявка!", message = $"Вашата заявка беше изпратена!" }));
        }
    }
}
