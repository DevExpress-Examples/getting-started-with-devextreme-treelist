using System.Linq;
using System.Text.Json;
using ASP_NET_Core.Models;
using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Mvc;
using Microsoft.AspNetCore.Mvc;

namespace ASP_NET_Core.Controllers;

public class EmployeeDataController : Controller {

    [HttpGet]
    public object Get(DataSourceLoadOptions loadOptions) {
        return DataSourceLoader.Load(EmployeeData.Employees.OrderBy(e => e.OrderIndex), loadOptions);
    }

    [HttpPost]
    public IActionResult Insert(string values) {
        var employee = new Employee();
        PopulateEmployee(employee, values);

        employee.ID = EmployeeData.Employees.Count > 0
            ? EmployeeData.Employees.Max(e => e.ID) + 1
            : 1;

        employee.OrderIndex = EmployeeData.Employees.Count > 0
            ? EmployeeData.Employees.Max(e => e.OrderIndex) + 1
            : 0;

        EmployeeData.Employees.Add(employee);

        return Ok(employee);
    }

    [HttpPut]
    public IActionResult Update(int key, string values) {
        var employee = EmployeeData.Employees.FirstOrDefault(e => e.ID == key);
        if (employee == null)
            return NotFound();

        var oldOrderIndex = employee.OrderIndex;

        PopulateEmployee(employee, values);

        var newOrderIndex = employee.OrderIndex;

        if (oldOrderIndex != newOrderIndex) {
            employee.OrderIndex = oldOrderIndex;
            var sortedEmployees = EmployeeData.Employees
                .OrderBy(e => e.OrderIndex)
                .ToList();

            if (oldOrderIndex < newOrderIndex) {
                for(var i = oldOrderIndex + 1; i <= newOrderIndex; i++) {
                    sortedEmployees[i].OrderIndex--;
                }
            } else {
                for(var i = newOrderIndex; i < oldOrderIndex; i++) {
                    sortedEmployees[i].OrderIndex++;
                }
            }
            employee.OrderIndex = newOrderIndex;
        }

        return Ok(employee);
    }

    [HttpDelete]
    public IActionResult Delete(int key) {
        var employee = EmployeeData.Employees.FirstOrDefault(e => e.ID == key);
        if (employee == null)
            return NotFound();

        EmployeeData.Employees.Remove(employee);
        return NoContent();
    }

    

    private static void PopulateEmployee(Employee employee, string values) {
        using var document = JsonDocument.Parse(values);
        foreach (var property in document.RootElement.EnumerateObject()) {
            switch (property.Name) {
                case nameof(Employee.HeadID):
                    employee.HeadID = property.Value.GetInt32();
                    break;
                case nameof(Employee.FullName):
                    employee.FullName = property.Value.GetString();
                    break;
                case nameof(Employee.Position):
                    employee.Position = property.Value.GetString();
                    break;
                case nameof(Employee.City):
                    employee.City = property.Value.GetString();
                    break;
                case nameof(Employee.State):
                    employee.State = property.Value.GetString();
                    break;
                case nameof(Employee.Email):
                    employee.Email = property.Value.GetString();
                    break;
                case nameof(Employee.Skype):
                    employee.Skype = property.Value.GetString();
                    break;
                case nameof(Employee.MobilePhone):
                    employee.MobilePhone = property.Value.GetString();
                    break;
                case nameof(Employee.BirthDate):
                    employee.BirthDate = property.Value.GetString();
                    break;
                case nameof(Employee.HireDate):
                    employee.HireDate = property.Value.GetString();
                    break;
                case nameof(Employee.OrderIndex):
                    employee.OrderIndex = property.Value.GetInt32();
                    break;
            }
        }
    }

}
