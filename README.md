# Company Management Backend API

A Node.js/Express REST API for managing company data with MySQL database integration.

## Features

- ✅ MySQL database integration
- ✅ RESTful API endpoints
- ✅ CRUD operations for companies
- ✅ Input validation
- ✅ Error handling
- ✅ CORS enabled
- ✅ Environment configuration

## Prerequisites

- Node.js (v16 or higher)
- MySQL Server
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

1. Create a MySQL database:

```sql
CREATE DATABASE company_db;
```

2. Update the `.env` file with your database credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=company_db
DB_PORT=3306
```

### 3. Start the Server

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Companies

| Method | Endpoint             | Description        |
| ------ | -------------------- | ------------------ |
| GET    | `/api/companies`     | Get all companies  |
| GET    | `/api/companies/:id` | Get company by ID  |
| POST   | `/api/companies`     | Create new company |
| PUT    | `/api/companies/:id` | Update company     |
| DELETE | `/api/companies/:id` | Delete company     |

### Other Endpoints

| Method | Endpoint  | Description       |
| ------ | --------- | ----------------- |
| GET    | `/`       | API documentation |
| GET    | `/health` | Health check      |

## Company Data Structure

```json
{
  "name": "Company Name (required)",
  "email": "company@example.com",
  "phone": "+1234567890",
  "address": "123 Business St, City, State",
  "industry": "Technology",
  "founded_year": 2020,
  "employee_count": 100,
  "website": "https://company.com",
  "description": "Company description"
}
```

## Example API Usage

### Create a Company

```bash
curl -X POST http://localhost:5000/api/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Corp",
    "email": "info@techcorp.com",
    "phone": "+1234567890",
    "industry": "Technology",
    "founded_year": 2020,
    "employee_count": 50
  }'
```

### Get All Companies

```bash
curl http://localhost:5000/api/companies
```

### Get Company by ID

```bash
curl http://localhost:5000/api/companies/1
```

## Database Schema

The API automatically creates a `companies` table with the following structure:

```sql
CREATE TABLE companies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  address TEXT,
  industry VARCHAR(100),
  founded_year INT,
  employee_count INT,
  website VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

## Environment Variables

| Variable      | Description    | Default     |
| ------------- | -------------- | ----------- |
| `DB_HOST`     | MySQL host     | localhost   |
| `DB_USER`     | MySQL username | root        |
| `DB_PASSWORD` | MySQL password | -           |
| `DB_NAME`     | Database name  | company_db  |
| `DB_PORT`     | MySQL port     | 3306        |
| `PORT`        | Server port    | 5000        |
| `NODE_ENV`    | Environment    | development |

## Project Structure

```
backend/
├── config/
│   └── database.js      # Database configuration
├── models/
│   └── Company.js       # Company model
├── routes/
│   └── companyRoutes.js # Company routes
├── .env                 # Environment variables
├── package.json         # Dependencies
├── server.js           # Main server file
└── README.md           # This file
```
