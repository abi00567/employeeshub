// Wrapper for async express route handlers
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 404 Route Not Found Handler
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: [${req.method}] ${req.originalUrl}`,
  });
};

// Global Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  // Handle PostgreSQL Unique Constraint Error (code: '23505') or legacy MySQL ER_DUP_ENTRY (1062)
  if (err.code === '23505' || err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
    return res.status(409).json({
      success: false,
      message: 'An employee with this email address already exists.',
      error: 'DuplicateEmail',
      field: 'email',
    });
  }

  // Handle PostgreSQL invalid input syntax (e.g. non-integer ID)
  if (err.code === '22P02') {
    return res.status(400).json({
      success: false,
      message: 'Invalid data format or identifier received.',
    });
  }

  // Handle invalid JSON body format
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON payload received.',
    });
  }

  // Default server error
  const statusCode = err.status || (res.statusCode === 200 ? 500 : res.statusCode);
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error. Please try again later.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = {
  asyncHandler,
  notFoundHandler,
  errorHandler,
};
