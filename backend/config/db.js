const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

let pool = null;
let isConnected = false;
let isFallbackMode = false;

// Determine connection configuration
const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.SUPABASE_DB_URL ||
  null;

const getPoolConfig = () => {
  if (connectionString) {
    const isLocalhost =
      connectionString.includes('localhost') || connectionString.includes('127.0.0.1');

    return {
      connectionString,
      ssl:
        isLocalhost || process.env.DB_SSL === 'false'
          ? false
          : { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 6000,
    };
  }

  const host = process.env.DB_HOST || process.env.PGHOST || 'localhost';
  const isLocalhost = host === 'localhost' || host === '127.0.0.1';

  return {
    host,
    port: parseInt(process.env.DB_PORT || process.env.PGPORT || '5432', 10),
    user: process.env.DB_USER || process.env.PGUSER || 'postgres',
    password: process.env.DB_PASSWORD || process.env.PGPASSWORD || '',
    database: process.env.DB_NAME || process.env.PGDATABASE || 'postgres',
    ssl:
      isLocalhost || process.env.DB_SSL === 'false'
        ? false
        : { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 6000,
  };
};

// In-memory store fallback if Supabase / PostgreSQL is not reachable in local test environments
const fallbackStore = [
  {
    employee_id: 1,
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@employeehub.io',
    department: 'Engineering',
    designation: 'Lead Full-Stack Architect',
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    employee_id: 2,
    name: 'Alex Rivera',
    email: 'alex.rivera@employeehub.io',
    department: 'Engineering',
    designation: 'Senior Frontend Engineer',
    created_at: new Date(Date.now() - 86400000 * 25).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 25).toISOString(),
  },
  {
    employee_id: 3,
    name: 'Priya Sharma',
    email: 'priya.sharma@employeehub.io',
    department: 'Product',
    designation: 'Principal Product Manager',
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
  {
    employee_id: 4,
    name: 'David Chen',
    email: 'david.chen@employeehub.io',
    department: 'Engineering',
    designation: 'DevOps & Cloud Engineer',
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
  {
    employee_id: 5,
    name: 'Elena Rostova',
    email: 'elena.rostova@employeehub.io',
    department: 'Design',
    designation: 'Lead UX/UI Designer',
    created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
  {
    employee_id: 6,
    name: 'Marcus Vance',
    email: 'marcus.vance@employeehub.io',
    department: 'Marketing',
    designation: 'Growth Marketing Specialist',
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 8).toISOString(),
  },
  {
    employee_id: 7,
    name: 'Aaliyah Patel',
    email: 'aaliyah.patel@employeehub.io',
    department: 'Human Resources',
    designation: 'HR Operations Lead',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    employee_id: 8,
    name: 'James Wilson',
    email: 'james.wilson@employeehub.io',
    department: 'Finance',
    designation: 'Senior Financial Analyst',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];
let nextId = 9;

const initDb = async () => {
  // If no DATABASE_URL and no DB_PASSWORD provided, fallback to memory immediately
  if (!connectionString && !process.env.DB_PASSWORD && !process.env.PGPASSWORD) {
    console.log('ℹ️ No PostgreSQL / Supabase connection string provided in .env.');
    console.log('🚀 Running in resilient in-memory database mode with sample employees.');
    console.log('💡 To connect to Supabase, set DATABASE_URL in your backend/.env file.');
    isConnected = true;
    isFallbackMode = true;
    return;
  }

  try {
    const config = getPoolConfig();
    pool = new Pool(config);

    // Test connection with timeout
    const client = await pool.connect();

    try {
      // Ensure employees table exists in PostgreSQL / Supabase
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS employees (
          employee_id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) NOT NULL UNIQUE,
          department VARCHAR(50) NOT NULL,
          designation VARCHAR(100) NOT NULL,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);
        CREATE INDEX IF NOT EXISTS idx_employees_name ON employees(name);
        CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
      `;
      await client.query(createTableQuery);

      // Check if table is empty; if so, seed sample records
      const countRes = await client.query('SELECT COUNT(*) as count FROM employees');
      if (parseInt(countRes.rows[0].count, 10) === 0) {
        console.log('Seeding initial employees into Supabase / PostgreSQL database...');
        const seedQuery = `
          INSERT INTO employees (name, email, department, designation) VALUES
          ('Sarah Jenkins', 'sarah.jenkins@employeehub.io', 'Engineering', 'Lead Full-Stack Architect'),
          ('Alex Rivera', 'alex.rivera@employeehub.io', 'Engineering', 'Senior Frontend Engineer'),
          ('Priya Sharma', 'priya.sharma@employeehub.io', 'Product', 'Principal Product Manager'),
          ('David Chen', 'david.chen@employeehub.io', 'Engineering', 'DevOps & Cloud Engineer'),
          ('Elena Rostova', 'elena.rostova@employeehub.io', 'Design', 'Lead UX/UI Designer'),
          ('Marcus Vance', 'marcus.vance@employeehub.io', 'Marketing', 'Growth Marketing Specialist'),
          ('Aaliyah Patel', 'aaliyah.patel@employeehub.io', 'Human Resources', 'HR Operations Lead'),
          ('James Wilson', 'james.wilson@employeehub.io', 'Finance', 'Senior Financial Analyst')
          ON CONFLICT (email) DO NOTHING;
        `;
        await client.query(seedQuery);
      }

      isConnected = true;
      isFallbackMode = false;
      console.log('✅ Connected to PostgreSQL / Supabase database successfully.');
    } finally {
      client.release();
    }
  } catch (error) {
    console.warn(`⚠️ PostgreSQL / Supabase Connection Notice: ${error.message}`);
    console.warn(' Operating in resilient in-memory database mode with sample data.');
    console.warn('💡 Set a valid DATABASE_URL in backend/.env to connect to live Supabase.');
    isConnected = true;
    isFallbackMode = true;
  }
};

/**
 * Execute a parameterized query against PostgreSQL or fallback store
 */
const query = async (text, params = []) => {
  if (isFallbackMode) {
    return handleFallbackQuery(text, params);
  }

  if (!pool) {
    throw new Error('Database connection pool is not initialized');
  }

  const result = await pool.query(text, params);
  return result.rows;
};

// Resilient memory query handler matching PostgreSQL queries
function handleFallbackQuery(sql, params) {
  const cleanSql = sql.trim().toUpperCase();

  // SELECT COUNT
  if (cleanSql.includes('SELECT COUNT(*)')) {
    return [{ count: fallbackStore.length }];
  }

  // SELECT ALL OR WITH WHERE / ORDER BY
  if (cleanSql.startsWith('SELECT') && cleanSql.includes('FROM EMPLOYEES')) {
    let result = [...fallbackStore];

    // Single item by ID
    if (cleanSql.includes('WHERE EMPLOYEE_ID = $1')) {
      const id = parseInt(params[0], 10);
      const item = fallbackStore.find((e) => e.employee_id === id);
      return item ? [item] : [];
    }

    // Check duplicate email (excluding specific id if updating)
    if (cleanSql.includes('WHERE LOWER(EMAIL) = LOWER($1) AND EMPLOYEE_ID != $2')) {
      const [email, id] = params;
      const match = fallbackStore.filter(
        (e) => e.email.toLowerCase() === email.toLowerCase() && e.employee_id !== parseInt(id, 10)
      );
      return match;
    }

    if (cleanSql.includes('WHERE LOWER(EMAIL) = LOWER($1)')) {
      const email = params[0];
      const match = fallbackStore.filter((e) => e.email.toLowerCase() === email.toLowerCase());
      return match;
    }

    // Filter by search / department query if provided
    if (params.length > 0 && (cleanSql.includes('ILIKE') || cleanSql.includes('LIKE'))) {
      const searchTerm = (params[0] || '').replace(/%/g, '').toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(searchTerm) ||
          e.email.toLowerCase().includes(searchTerm) ||
          e.department.toLowerCase().includes(searchTerm) ||
          e.designation.toLowerCase().includes(searchTerm)
      );
    }

    if (cleanSql.includes('DEPARTMENT = $') || cleanSql.includes('DEPARTMENT =$')) {
      const deptParam = params[params.length - 1];
      if (deptParam && deptParam !== 'All') {
        result = result.filter((e) => e.department.toLowerCase() === deptParam.toLowerCase());
      }
    }

    if (cleanSql.includes('ORDER BY CREATED_AT DESC') || cleanSql.includes('ORDER BY EMPLOYEE_ID DESC')) {
      result.sort((a, b) => b.employee_id - a.employee_id);
    }

    return result;
  }

  // INSERT INTO EMPLOYEES ... RETURNING *
  if (cleanSql.startsWith('INSERT INTO EMPLOYEES')) {
    const [name, email, department, designation] = params;
    const newEmp = {
      employee_id: nextId++,
      name,
      email,
      department,
      designation,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    fallbackStore.unshift(newEmp);
    return [newEmp];
  }

  // UPDATE EMPLOYEES ... RETURNING *
  if (cleanSql.startsWith('UPDATE EMPLOYEES')) {
    const [name, email, department, designation, id] = params;
    const targetId = parseInt(id, 10);
    const index = fallbackStore.findIndex((e) => e.employee_id === targetId);

    if (index !== -1) {
      fallbackStore[index] = {
        ...fallbackStore[index],
        name,
        email,
        department,
        designation,
        updated_at: new Date().toISOString(),
      };
      return [fallbackStore[index]];
    }
    return [];
  }

  // DELETE FROM EMPLOYEES ... RETURNING *
  if (cleanSql.startsWith('DELETE FROM EMPLOYEES')) {
    const id = parseInt(params[0], 10);
    const index = fallbackStore.findIndex((e) => e.employee_id === id);
    if (index !== -1) {
      const deleted = fallbackStore.splice(index, 1)[0];
      return [deleted];
    }
    return [];
  }

  return [];
}

module.exports = {
  initDb,
  query,
  getPool: () => pool,
  isFallback: () => isFallbackMode,
};
