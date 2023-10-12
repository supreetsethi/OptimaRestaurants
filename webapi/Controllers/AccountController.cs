﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using webapi.DTOs.Account;
using webapi.Models;
using webapi.Services;

namespace webapi.Controllers
{
    public class AccountController : Controller
    {
        private readonly JWTService _jwtService;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;

        public AccountController(JWTService jwtService,
        SignInManager<ApplicationUser> signInManager,
        UserManager<ApplicationUser> userManager)
        {
            _jwtService = jwtService;
            _signInManager = signInManager;
            _userManager = userManager;
        }

        [HttpPost("login")]
        public async Task<ActionResult<ApplicationUserDto>> Login(LoginDto model)
        {
            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user == null) return Unauthorized("Invalid email or password");

            if (user.EmailConfirmed == false) return Unauthorized("Please confirm your email");

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
            if (!result.Succeeded) return Unauthorized("Invalid email or password");

            return CreateApplicationUserDto(user);
        }

        [Authorize]
        [HttpGet("refresh-user-token")]
        public async Task<ActionResult<ApplicationUserDto>> RefreshUserToken()
        {
            var user = await _userManager.FindByNameAsync(User.FindFirst(ClaimTypes.Email)?.Value);
            return CreateApplicationUserDto(user);
        }

        [HttpPost("register")]
        public async Task<ActionResult<ApplicationUserDto>> Register(RegisterDto model)
        {
            if (await CheckEmailExistAsync(model.Email))
            {
                return BadRequest($"Already exists an account with this email address");
            }

            var userToAdd = new ApplicationUser
            {
                FirstName = model.FirstName.ToLower(),
                LastName = model.LastName.ToLower(),
                Email = model.Email.ToLower(),
                UserName = model.Email.ToLower(),
                EmailConfirmed = true // subject to change
            };

            var result = await _userManager.CreateAsync(userToAdd, model.Password);
            if (!result.Succeeded) return BadRequest(result.Errors);

            return Ok(new JsonResult(new {title = "Account created", message = "Your account has been created, you can login" })); // change to login directly
        }

        private ApplicationUserDto CreateApplicationUserDto(ApplicationUser user)
        {
            return new ApplicationUserDto
            {
                Email = user.Email,
                JWT = _jwtService.CreateJWT(user)
            };
        }
        private async Task<bool> CheckEmailExistAsync(string email)
        {
            return await _userManager.Users.AnyAsync(x => x.Email == email.ToLower());
        }
    }
}
