const express = require('express');
const router = express.Router();
const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats,
} = require('../controllers/employeeController');
const { validateEmployee } = require('../middleware/validator');

// Meta / statistics endpoint
router.get('/meta/stats', getEmployeeStats);

// Main CRUD endpoints
router.route('/')
  .get(getAllEmployees)
  .post(validateEmployee, createEmployee);

router.route('/:id')
  .get(getEmployeeById)
  .put(validateEmployee, updateEmployee)
  .delete(deleteEmployee);

module.exports = router;
