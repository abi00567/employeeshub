const db = require('../config/db');

const EmployeeModel = {
  // Find all employees with optional search and department filter
  async findAll({ search = '', department = '' } = {}) {
    let sql = 'SELECT * FROM employees';
    const params = [];
    const conditions = [];

    if (search && search.trim() !== '') {
      params.push(`%${search.trim()}%`);
      const idx = params.length;
      conditions.push(`(name ILIKE $${idx} OR email ILIKE $${idx} OR designation ILIKE $${idx} OR department ILIKE $${idx})`);
    }

    if (department && department.trim() !== '' && department.toLowerCase() !== 'all') {
      params.push(department.trim());
      const idx = params.length;
      conditions.push(`department = $${idx}`);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY created_at DESC, employee_id DESC';

    return await db.query(sql, params);
  },

  // Find employee by employee_id
  async findById(id) {
    const sql = 'SELECT * FROM employees WHERE employee_id = $1';
    const rows = await db.query(sql, [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  // Find employee by email (optional excludeId for update uniqueness check)
  async findByEmail(email, excludeId = null) {
    if (excludeId) {
      const sql = 'SELECT * FROM employees WHERE LOWER(email) = LOWER($1) AND employee_id != $2';
      const rows = await db.query(sql, [email, excludeId]);
      return rows.length > 0 ? rows[0] : null;
    }
    const sql = 'SELECT * FROM employees WHERE LOWER(email) = LOWER($1)';
    const rows = await db.query(sql, [email]);
    return rows.length > 0 ? rows[0] : null;
  },

  // Create a new employee with PostgreSQL RETURNING *
  async create({ name, email, department, designation }) {
    const sql = `
      INSERT INTO employees (name, email, department, designation)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const rows = await db.query(sql, [
      name.trim(),
      email.trim().toLowerCase(),
      department.trim(),
      designation.trim(),
    ]);

    return rows && rows.length > 0 ? rows[0] : null;
  },

  // Update existing employee with PostgreSQL RETURNING *
  async update(id, { name, email, department, designation }) {
    const sql = `
      UPDATE employees
      SET name = $1, email = $2, department = $3, designation = $4
      WHERE employee_id = $5
      RETURNING *
    `;
    const rows = await db.query(sql, [
      name.trim(),
      email.trim().toLowerCase(),
      department.trim(),
      designation.trim(),
      id,
    ]);

    return rows && rows.length > 0 ? rows[0] : null;
  },

  // Delete employee by ID
  async delete(id) {
    const sql = 'DELETE FROM employees WHERE employee_id = $1 RETURNING *';
    const rows = await db.query(sql, [id]);
    return rows && rows.length > 0;
  },

  // Retrieve metrics for dashboard
  async getStats() {
    const all = await this.findAll();
    const totalEmployees = all.length;
    const departments = [...new Set(all.map((e) => e.department))];
    const departmentCounts = departments.reduce((acc, dept) => {
      acc[dept] = all.filter((e) => e.department === dept).length;
      return acc;
    }, {});

    return {
      totalEmployees,
      departmentCount: departments.length,
      departments,
      departmentCounts,
    };
  },
};

module.exports = EmployeeModel;
