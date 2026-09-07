// Email regex validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmployee = (req, res, next) => {
  const { name, email, department, designation } = req.body;
  const errors = [];

  // Name validation
  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push({ field: 'name', message: 'Employee name is required.' });
  } else if (name.trim().length < 2 || name.trim().length > 100) {
    errors.push({ field: 'name', message: 'Name must be between 2 and 100 characters.' });
  }

  // Email validation
  if (!email || typeof email !== 'string' || email.trim() === '') {
    errors.push({ field: 'email', message: 'Email address is required.' });
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push({ field: 'email', message: 'Please provide a valid email address.' });
  } else if (email.trim().length > 100) {
    errors.push({ field: 'email', message: 'Email cannot exceed 100 characters.' });
  }

  // Department validation
  if (!department || typeof department !== 'string' || department.trim() === '') {
    errors.push({ field: 'department', message: 'Department is required.' });
  } else if (department.trim().length < 2 || department.trim().length > 50) {
    errors.push({ field: 'department', message: 'Department must be between 2 and 50 characters.' });
  }

  // Designation validation
  if (!designation || typeof designation !== 'string' || designation.trim() === '') {
    errors.push({ field: 'designation', message: 'Designation / Job Title is required.' });
  } else if (designation.trim().length < 2 || designation.trim().length > 100) {
    errors.push({ field: 'designation', message: 'Designation must be between 2 and 100 characters.' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please check the provided inputs.',
      errors,
    });
  }

  next();
};

module.exports = {
  validateEmployee,
};
