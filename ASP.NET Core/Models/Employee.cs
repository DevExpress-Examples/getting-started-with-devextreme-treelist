using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ASP_NET_Core.Models;
public class Employee {
    public int ID { get; set; }
    public int HeadID { get; set; }
    public string FullName { get; set; }
    public string Position { get; set; }
    public string City { get; set; }
    public string State { get; set; }
    public string Email { get; set; }
    public string Skype { get; set; }
    public string MobilePhone { get; set; }
    public string BirthDate { get; set; }
    public string HireDate { get; set; }
}
