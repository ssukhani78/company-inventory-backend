# Company Management System API

A comprehensive RESTful API for managing companies, items, sales, and user authentication. Built with Node.js, Express, and MySQL, this system provides a robust backend for business management applications.

## 📋 Overview

The Company Management System API is designed to handle business operations including company registration, product/item management, sales tracking, and user authentication. It follows modern REST API conventions with comprehensive validation, error handling, and JWT-based authentication.

### Key Features

- **Complete CRUD Operations** for companies, items, and sales
- **JWT Authentication** with secure token-based access control
- **Input Validation** using Joi schemas with detailed error messages
- **Database Relations** with foreign key constraints for data integrity
- **Comprehensive Error Handling** with development/production modes
- **Clean Architecture** with separated concerns (Models, Controllers, Routes)
- **Professional Logging** with detailed error tracking

## 🚀 Features

### Authentication & User Management

- User registration and login
- JWT token-based authentication
- Password hashing with bcrypt
- Profile management
- Password change functionality

### Company Management

- Create, read, update, delete companies
- GST number validation and uniqueness
- Company status management (active/inactive)
- Address and contact information management

### Item/Product Management

- Complete item CRUD operations
- HSN code support for tax compliance
- Item status tracking
- Description and categorization

### Sales Management

- Sales record creation and management
- Company-item relationship tracking
- Multiple unit types (box, kgs, mtr, ltr, pcs, roll, pkt, nos, bundle, lot)
- Sales history with company and item details

## 🛠️ Tech Stack

### Backend Technologies

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Relational database
- **JWT** - Authentication tokens
- **Bcrypt.js** - Password hashing

### Validation & Middleware

- **Joi** - Schema validation
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Development Tools

- **Nodemon** - Development server with auto-restart
- **UUID** - Unique identifier generation

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # Database connection configuration
├── controllers/
│   ├── companyController.js  # Company business logic
│   ├── itemController.js     # Item business logic
│   ├── salesController.js    # Sales business logic
│   └── userController.js     # User authentication logic
├── middlewares/
│   ├── auth.js              # JWT authentication middleware
│   ├── errorHandler.js      # Global error handling
│   └── validate.js          # Joi validation schemas
├── models/
│   ├── company.js           # Company database operations
│   ├── item.js              # Item database operations
│   ├── sales.js             # Sales database operations
│   └── user.js              # User database operations
├── routes/
│   ├── companyRoutes.js     # Company API endpoints
│   ├── itemRoutes.js        # Item API endpoints
│   ├── salesRoutes.js       # Sales API endpoints
│   └── userRoutes.js        # User API endpoints
├── init-db.js               # Database initialization script
├── server.js                # Main application entry point
└── package.json             # Dependencies and scripts
```

## ⚙️ Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd CompanyProject_Practice/backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create a `.env` file in the backend root directory:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=viewList

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key

   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

4. **Database Setup**

   Initialize the database and create tables:

   ```bash
   node init-db.js
   ```

5. **Start the Development Server**

   ```bash
   npm start
   # or
   npm run dev
   ```

   The server will start on `http://localhost:5000`

### Database Schema

The system automatically creates the following tables:

- **users**: User authentication and profile data
- **company**: Company information with GST and address details
- **item**: Product/item catalog with HSN codes
- **sales**: Sales transactions linking companies and items

## 📚 API Documentation

### Base URL

```
http://localhost:5000
```

### Authentication

Most endpoints require authentication. Include the JWT token in the `authtoken` header:

```
authtoken: your_jwt_token_here
```

### API Endpoints

#### Authentication Endpoints

```
POST /auth/register          # Register new user
POST /auth/login             # User login
GET  /auth/profile           # Get user profile (protected)
PUT  /auth/profile           # Update user profile (protected)
PUT  /auth/change-password   # Change password (protected)
DELETE /auth/:id             # Delete user (protected)
```

#### Company Endpoints

```
POST   /company              # Create new company (protected)
GET    /company              # Get all companies (protected)
GET    /company/:id          # Get company by ID (protected)
PUT    /company/:id          # Update company (protected)
DELETE /company/:id          # Delete company (protected)
```

#### Item Endpoints

```
POST   /item                 # Create new item (protected)
GET    /item                 # Get all items (protected)
GET    /item/:id             # Get item by ID (protected)
PUT    /item/:id             # Update item (protected)
DELETE /item/:id             # Delete item (protected)
```

#### Sales Endpoints

```
POST   /sales                # Create new sale (protected)
GET    /sales                # Get all sales (protected)
GET    /sales/:id            # Get sale by ID (protected)
PUT    /sales/:id            # Update sale (protected)
DELETE /sales/:id            # Delete sale (protected)
```

### Request/Response Examples

#### User Registration

```json
POST /auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}

Response:
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "uuid-here",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

#### Create Company

```json
POST /company
Headers: { "authtoken": "jwt_token_here" }
{
  "name": "Tech Solutions Pvt Ltd",
  "gstNo": "27ABCDE1234F1Z5",
  "email": "contact@techsolutions.com",
  "phone": "9876543210",
  "address": "123 Business Park",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "status": "active"
}
```

#### Create Sale

```json
POST /sales
Headers: { "authtoken": "jwt_token_here" }
{
  "companyId": "company-uuid-here",
  "itemId": "item-uuid-here",
  "unit": "box"
}
```

### Response Format

All API responses follow a consistent format:

**Success Response:**

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    /* response data */
  },
  "count": 10 // for list endpoints
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "field": "fieldName",
    "message": "Detailed error message",
    "value": "invalid_value"
  }
}
```

## 🚀 Deployment Instructions

### Heroku Deployment

1. **Install Heroku CLI** and login

   ```bash
   heroku login
   ```

2. **Create Heroku App**

   ```bash
   heroku create your-app-name
   ```

3. **Add MySQL Add-on**

   ```bash
   heroku addons:create cleardb:ignite
   ```

4. **Set Environment Variables**

   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your_production_jwt_secret
   ```

5. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

### Render Deployment

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables in Render dashboard
6. Deploy

### Railway Deployment

1. Connect GitHub repository to Railway
2. Add environment variables
3. Railway will auto-deploy on commits

## 🤝 Contributing

We welcome contributions to improve the Company Management System API!

### Development Guidelines

1. **Fork the repository** and create a feature branch
2. **Follow the existing code style** and patterns
3. **Add appropriate validation** for new endpoints
4. **Include error handling** for all operations
5. **Test your changes** thoroughly
6. **Update documentation** if needed

### Code Style

- Use consistent indentation (2 spaces)
- Follow RESTful API conventions
- Include descriptive comments for complex logic
- Use meaningful variable and function names

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes with appropriate tests
3. Update documentation if needed
4. Submit a pull request with a clear description

## 📄 License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2024 Company Management System

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📞 Support

For support, bug reports, or feature requests, please create an issue in the repository or contact the development team.

---

**Built with ❤️ using Node.js, Express, and MySQL**
