using CrudAuthencationProject.Domain.Entities;
using CrudAuthencationProject.Persistance.Context;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using System.Text;
using System.Security.Claims;
using Microsoft.IdentityModel.JsonWebTokens;
using System.IdentityModel.Tokens.Jwt;

namespace CrudAuthencationProject.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public EmployeesController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost]
        [Route("Register")]
        public async Task<IActionResult> Register(EmployeeDTO employeeDTO)
        {
            if (await _context.Employees.AnyAsync(e=>e.Email == employeeDTO.Email))
            {
                return BadRequest("E-posta zaten kullanılıyor");
            }
            var employee = new Employee
            {
                Email = employeeDTO.Email,
                Name = employeeDTO.Name,
                Password = BCrypt.Net.BCrypt.HashPassword(employeeDTO.Password)
            };
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login(LoginDTO loginDTO)
        {
            var employee = await _context.Employees.SingleOrDefaultAsync(e => e.Email == loginDTO.Email);
            if (employee == null)
            {
                return Unauthorized("Geçersiz email veya şifre");
            }
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDTO.Password, employee.Password);
            if (!isPasswordValid)
            {
                return Unauthorized("Geçersiz email veya şifre");
            }

            return Ok(new 
            {user = new 
            { employee.ID, employee.Name, employee.Email,employee.IsAdmin } 
            });
        }

       

        [HttpGet]
        [Route("GetAllUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            var employees = await _context.Employees.ToListAsync();
            var employeeDTOs = employees.Select(e => new EmployeeDTO
            {
                Email = e.Email,
                Name = e.Name,
                Password = e.Password,
                ID = e.ID,
                IsActive = e.IsActive,
            }).ToList();
            return Ok(employeeDTOs);
        }



        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound("Kullanıcı bulunamadı");
            }
            return Ok(employee);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateEmployee(EmployeeDTO employeeDTO)
        {
            var employee = await _context.Employees.FirstOrDefaultAsync(x=>x.ID == employeeDTO.ID);
            if (employee == null)
            {
                return NotFound("çalışan yok");
            }

            employee.Name = employeeDTO.Name;
            employee.Email = employeeDTO.Email;
            employee.Password = BCrypt.Net.BCrypt.HashPassword(employeeDTO.Password);
            employee.IsActive = employeeDTO.IsActive;

            await _context.SaveChangesAsync();
            return Ok("çalışan güncellendi");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var employee = await _context.Employees.FirstOrDefaultAsync(e => e.ID == id);
            if (employee == null)
            {
                return NotFound("Kullanıcı bulunamadı");
            }
            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
            return Ok("Kullanıcı silindi");
        }
    }
}
