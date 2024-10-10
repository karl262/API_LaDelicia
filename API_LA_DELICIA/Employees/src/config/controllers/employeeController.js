const Employee = require('../models/employeeModel');

class EmployeeController {

    static async getAllEmployees(req, res) {
        try {
            const employees = await Employee.findAll();
            res.json(employees);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getEmployeeById(req, res) {
        try {
            const employee = await Employee.findById(req.params.id);
            if (!employee) {
                return res.status(404).json({ message: "Empleado no encontrado" });
            }
            res.json(employee);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getEmployeeByName(req, res) {
        try {
            const employees = await Employee.findByName(req.params.name);
            if (employees.length === 0) {
                return res.status(404).json({ message: "Empleado no escontrado con este nombre" });
            }
            res.json(employees);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getEmployeeBySalary(req, res) {
        try {
            const employees = await Employee.findBySalary(req.params.salary);
            if (employees.length === 0) {
                return res.status(404).json({ message: "Empleado no encontrado con este nombre" });
            }
            res.json(employees);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async createEmployee(req, res) {
        const { name, email, cellphone_number, salary } = req.body;
        try {
            const newEmployee = await Employee.create(name, email, cellphone_number, salary);
            res.status(201).json(newEmployee);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateEmployee(req, res) {
        const { name, email, cellphone_number, salary } = req.body;
        try {
            const updatedEmployee = await Employee.update(req.params.id, name, email, cellphone_number, salary);
            if (!updatedEmployee) {
                return res.status(404).json({ message: "Empleado no encontrado" });
            }
            res.json(updatedEmployee);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteEmployee(req, res) {
        try {
            const deletedEmployee = await Employee.delete(req.params.id);
            if (!deletedEmployee) {
                return res.status(404).json({ message: "Empleado no encontrado" });
            }
            res.json(deletedEmployee);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = EmployeeController;
