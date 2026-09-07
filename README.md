# EmployeeHub – Employee Management Directory

A modern, responsive, full-stack enterprise employee management directory built with **React.js**, **Node.js**, **Express.js**, and **MySQL**.

![EmployeeHub Preview](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Node](https://img.shields.io/badge/Node.js-v18%2B-green?style=for-the-badge&logo=node.js)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?style=for-the-badge&logo=mysql)

---

## 🌟 Key Features

### 🖥️ Frontend (React.js)
- **Modern Glassmorphic Dark UI**: Built with custom CSS design tokens, smooth micro-interactions, and glowing ambient gradients.
- **Dual View Modes**: Switch dynamically between **Grid Card View** and **Interactive Table View**.
- **Instant Search & Filter**: Real-time multi-field search (by Name, Email, Designation, or Department) with quick-filter pills.
- **Full Employee CRUD**:
  - Add new employee with live validation.
  - Edit existing employee details with pre-filled forms.
  - Delete employee with danger confirmation modal.
- **Loading & Empty States**: Shimmer skeleton animations during fetching and visual empty state illustrations.
- **Toast Notifications**: Interactive notification toasts for successful actions and error messages.
- **Fully Responsive**: Optimized for Mobile (<640px), Tablet (<1024px), and Desktop screens.

### ⚙️ Backend (Node.js & Express.js)
- **RESTful API**: Standardized endpoints for employee lifecycle management.
- **Input Validation**: Robust middleware ensuring valid emails, character limits, and non-empty required fields.
- **Security & CORS**: Whitelisted CORS origins, parameterized SQL queries preventing SQL injection, and zero hardcoded credentials.
- **Error Handling**: Centralized error middleware handling duplicate emails, database down-times, and bad payloads.
- **Resilient Fallback Support**: Automatically bootstraps MySQL schema; provides in-memory fallback if MySQL service is temporarily unavailable.

### 🗄️ Database (MySQL)
- `employees` table schema with primary keys, indexes, and timestamps:
  - `employee_id` (INT, AUTO_INCREMENT PRIMARY KEY)
  - `name` (VARCHAR(100) NOT NULL)
  - `email` (VARCHAR(100) NOT NULL UNIQUE)
  - `department` (VARCHAR(50) NOT NULL)
  - `designation` (VARCHAR(100) NOT NULL)
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)

---

## 📁 Project Structure

```text
employeeshub/
├── .github/
│   └── workflows/
│       └── ci.yml                     # GitHub Actions CI workflow
├── backend/
│   ├── config/
│   │   └── db.js                      # MySQL connection pool & fallback store
│   ├── controllers/
│   │   └── employeeController.js      # REST API CRUD controller logic
│   ├── middleware/
│   │   ├── errorHandler.js            # Error middleware & async wrapper
│   │   └── validator.js               # Payload validation middleware
│   ├── models/
│   │   └── employeeModel.js           # SQL queries & database abstraction layer
│   ├── routes/
│   │   └── employeeRoutes.js          # Route definitions for /api/employees
│   ├── scripts/
│   │   └── init-db.sql                # SQL initialization & sample data seed script
│   ├── .env.example                   # Backend environment template
│   ├── .gitignore                     # Backend gitignore
│   ├── package.json                   # Backend dependencies
│   └── server.js                      # Express server entry point
├── frontend/
│   ├── public/
│   │   └── favicon.svg                # Brand icon
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx             # Top navigation bar
│   │   │   ├── StatsOverview.jsx      # Metrics overview cards
│   │   │   ├── FilterBar.jsx          # Live search & department filters
│   │   │   ├── EmployeeCard.jsx       # Grid card component
│   │   │   ├── EmployeeTable.jsx      # Responsive table component
│   │   │   ├── EmployeeModal.jsx      # Add / Edit modal dialog
│   │   │   ├── DeleteConfirmModal.jsx # Delete confirmation modal
│   │   │   ├── LoadingSkeleton.jsx    # Shimmer skeleton loader
│   │   │   ├── EmptyState.jsx         # Fallback empty state
│   │   │   └── Toast.jsx              # Notification toast system
│   │   ├── services/
│   │   │   └── api.js                 # REST API client
│   │   ├── App.jsx                    # Root React component
│   │   ├── App.css                    # Component stylesheet
│   │   ├── index.css                  # Global design tokens & CSS resets
│   │   └── main.jsx                   # React DOM entry
│   ├── .env.example                   # Frontend environment template
│   ├── .gitignore                     # Frontend gitignore
│   ├── index.html                     # HTML root template
│   ├── package.json                   # Frontend dependencies
│   └── vite.config.js                 # Vite build configuration
├── .gitignore                         # Root gitignore
├── .env.example                       # Root environment template
└── README.md                          # Documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MySQL**: v8.0 or higher (Optional for testing, automatic fallback enabled)

---

### 1. Clone & Configure

```bash
git clone <your-repo-url>
cd employeeshub
```

#### Backend Setup:
```bash
cd backend
npm install
cp .env.example .env
```
Edit `backend/.env` with your MySQL database credentials:
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=employeehub_db
CLIENT_URL=http://localhost:5173
```

#### Frontend Setup:
```bash
cd ../frontend
npm install
cp .env.example .env
```
Edit `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

### 2. Database Initialization (MySQL)

You can run the SQL initialization script directly in your MySQL shell or client:

```bash
mysql -u root -p < backend/scripts/init-db.sql
```

*Note: The backend will also automatically create the `employees` table and seed sample records upon starting if the table does not exist.*

---

### 3. Running the Application

#### Start Backend Server:
```bash
cd backend
npm run dev   # or npm start
```
> Backend runs at `http://localhost:5000`

#### Start Frontend Client:
```bash
cd frontend
npm run dev
```
> Frontend runs at `http://localhost:5173`

Open your browser and navigate to `http://localhost:5173`.

---

## 📡 REST API Reference

| Method | Endpoint | Description | Query / Body Parameters |
|---|---|---|---|
| `GET` | `/api/employees` | Get all employees | `?search=query&department=Name` |
| `GET` | `/api/employees/:id` | Get single employee by ID | URL parameter `:id` |
| `POST` | `/api/employees` | Create a new employee | `{ name, email, department, designation }` |
| `PUT` | `/api/employees/:id` | Update an existing employee | `{ name, email, department, designation }` |
| `DELETE` | `/api/employees/:id` | Delete an employee by ID | URL parameter `:id` |
| `GET` | `/api/employees/meta/stats` | Get stats & department metrics | None |
| `GET` | `/api/health` | Service health check | None |

### Sample JSON Request Body (POST / PUT)
```json
{
  "name": "Sarah Jenkins",
  "email": "sarah.jenkins@employeehub.io",
  "department": "Engineering",
  "designation": "Lead Full-Stack Architect"
}
```

### Sample JSON Response
```json
{
  "success": true,
  "message": "Employee created successfully.",
  "data": {
    "employee_id": 1,
    "name": "Sarah Jenkins",
    "email": "sarah.jenkins@employeehub.io",
    "department": "Engineering",
    "designation": "Lead Full-Stack Architect",
    "created_at": "2026-09-07T04:43:29.000Z",
    "updated_at": "2026-09-07T04:43:29.000Z"
  }
}
```

---

## 🧪 Testing & CI

The repository includes a continuous integration workflow located in `.github/workflows/ci.yml` that validates:
1. Backend syntax and module resolution.
2. Frontend production build and bundle integrity.

To build the frontend for production manually:
```bash
cd frontend
npm run build
```

---

## 📄 License
This project is licensed under the MIT License.
