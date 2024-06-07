using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CrudAuthencationProject.Domain.Entities
{
    public class Employee
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedOn { get; set; } = DateTime.Now;
        public bool IsAdmin { get; set; }
    }
}
