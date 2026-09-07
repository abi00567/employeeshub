const EmployeeModel = require('../models/employeeModel');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @desc    Get all employees with optional search and department filter
 * @route   GET /api/employees
 * @access  Public
 */
const getAllEmployees = asyncHandler(async (req, res) => {
  const { search = '', department = '' } = req.query;

  const employees = await EmployeeModel.findAll({ search, department });

  res.status(200).json({
    success: true,
    count: employees.length,
    data: employees,
  });
});

/**
 * @desc    Get single employee by ID
 * @route   GET /api/employees/:id
 * @access  Public
 */
const getEmployeeById = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid employee ID provided.',
    });
  }

  const employee = await EmployeeModel.findById(id);

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: `Employee not found with ID ${id}.`,
    });
  }

  res.status(200).json({
    success: true,
    data: employee,
  });
});

/**
 * @desc    Create a new employee
 * @route   POST /api/employees
 * @access  Public
 */
const createEmployee = asyncHandler(async (req, res) => {
  const { name, email, department, designation } = req.body;

  // Check if email already exists
  const existingEmployee = await EmployeeModel.findByEmail(email.trim());
  if (existingEmployee) {
    return res.status(409).json({
      success: false,
      message: `An employee with email '${email}' already exists.`,
      field: 'email',
    });
  }

  const newEmployee = await EmployeeModel.create({
    name,
    email,
    department,
    designation,
  });

  res.status(201).json({
    success: true,
    message: 'Employee created successfully.',
    data: newEmployee,
  });
});

/**
 * @desc    Update an existing employee
 * @route   PUT /api/employees/:id
 * @access  Public
 */
const updateEmployee = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid employee ID provided.',
    });
  }

  const { name, email, department, designation } = req.body;

  // Check if employee exists
  const existingEmployee = await EmployeeModel.findById(id);
  if (!existingEmployee) {
    return res.status(404).json({
      success: false,
      message: `Employee not found with ID ${id}.`,
    });
  }

  // Check if email belongs to another employee
  const duplicateEmail = await EmployeeModel.findByEmail(email.trim(), id);
  if (duplicateEmail) {
    return res.status(409).json({
      success: false,
      message: `The email '${email}' is already in use by another employee.`,
      field: 'email',
    });
  }

  const updatedEmployee = await EmployeeModel.update(id, {
    name,
    email,
    department,
    designation,
  });

  res.status(200).json({
    success: true,
    message: 'Employee updated successfully.',
    data: updatedEmployee,
  });
});

/**
 * @desc    Delete an employee
 * @route   DELETE /api/employees/:id
 * @access  Public
 */
const deleteEmployee = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid employee ID provided.',
    });
  }

  const existingEmployee = await EmployeeModel.findById(id);
  if (!existingEmployee) {
    return res.status(404).json({
      success: false,
      message: `Employee not found with ID ${id}.`,
    });
  }

  await EmployeeModel.delete(id);

  res.status(200).json({
    success: true,
    message: `Employee '${existingEmployee.name}' (ID: ${id}) was successfully deleted.`,
    data: { employee_id: id },
  });
});

/**
 * @desc    Get stats summary (counts, departments)
 * @route   GET /api/employees/meta/stats
 * @access  Public
 */
const getEmployeeStats = asyncHandler(async (req, res) => {
  const stats = await EmployeeModel.getStats();
  res.status(200).json({
    success: true,
    data: stats,
  });
});

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats,
};
