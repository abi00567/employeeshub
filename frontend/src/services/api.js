const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Handle HTTP response and standardize errors
 */
async function handleResponse(response) {
  let data;
  try {
    data = await response.json();
  } catch (err) {
    throw new Error('Invalid response from server.');
  }

  if (!response.ok) {
    const errorMsg = data?.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.field = data?.field;
    error.errors = data?.errors;
    throw error;
  }

  return data;
}

export const api = {
  // GET /api/employees (with optional search and department filters)
  async getEmployees({ search = '', department = '' } = {}) {
    const params = new URLSearchParams();
    if (search && search.trim()) params.append('search', search.trim());
    if (department && department !== 'All') params.append('department', department.trim());

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`${API_BASE_URL}/employees${queryString}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    return handleResponse(response);
  },

  // GET /api/employees/:id
  async getEmployeeById(id) {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    return handleResponse(response);
  },

  // POST /api/employees
  async createEmployee(employeeData) {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(employeeData),
    });
    return handleResponse(response);
  },

  // PUT /api/employees/:id
  async updateEmployee(id, employeeData) {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(employeeData),
    });
    return handleResponse(response);
  },

  // DELETE /api/employees/:id
  async deleteEmployee(id) {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
    });
    return handleResponse(response);
  },

  // GET /api/employees/meta/stats
  async getStats() {
    const response = await fetch(`${API_BASE_URL}/employees/meta/stats`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    return handleResponse(response);
  },
};
