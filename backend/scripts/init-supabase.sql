-- =============================================================================
-- EmployeeHub Database Schema & Seed Script (Supabase / PostgreSQL)
-- =============================================================================
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your project -> Go to the "SQL Editor" in the left sidebar.
-- 3. Click "New query", paste this entire script, and click "Run".
-- =============================================================================

-- 1. Create employees table
CREATE TABLE IF NOT EXISTS employees (
  employee_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  department VARCHAR(50) NOT NULL,
  designation VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create performance indexes
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);
CREATE INDEX IF NOT EXISTS idx_employees_name ON employees(name);
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);

-- 3. Trigger to auto-update updated_at timestamp on row modification
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_employees_updated_at ON employees;
CREATE TRIGGER trg_employees_updated_at
BEFORE UPDATE ON employees
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 4. Seed initial sample data
INSERT INTO employees (name, email, department, designation)
VALUES
  ('Sarah Jenkins', 'sarah.jenkins@employeehub.io', 'Engineering', 'Lead Full-Stack Architect'),
  ('Alex Rivera', 'alex.rivera@employeehub.io', 'Engineering', 'Senior Frontend Engineer'),
  ('Priya Sharma', 'priya.sharma@employeehub.io', 'Product', 'Principal Product Manager'),
  ('David Chen', 'david.chen@employeehub.io', 'Engineering', 'DevOps & Cloud Engineer'),
  ('Elena Rostova', 'elena.rostova@employeehub.io', 'Design', 'Lead UX/UI Designer'),
  ('Marcus Vance', 'marcus.vance@employeehub.io', 'Marketing', 'Growth Marketing Specialist'),
  ('Aaliyah Patel', 'aaliyah.patel@employeehub.io', 'Human Resources', 'HR Operations Lead'),
  ('James Wilson', 'james.wilson@employeehub.io', 'Finance', 'Senior Financial Analyst')
ON CONFLICT (email) DO NOTHING;

-- 5. Enable Row Level Security (RLS) & Public Policy (Optional, for Supabase REST/Anon access)
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to employees"
  ON employees FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to employees"
  ON employees FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to employees"
  ON employees FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete to employees"
  ON employees FOR DELETE
  USING (true);
