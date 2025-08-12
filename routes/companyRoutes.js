const express = require('express');
const router = express.Router();

// Import controller and validation middleware
const CompanyController = require('../controllers/companyController');
const { 
  validateCreateCompany, 
  validateUpdateCompany, 
} = require('../middlewares/validate');
const { authenticateToken } = require('../middlewares/auth');

/**
 * Company Routes
 * Clean routes that only define endpoints and call controllers
 */

// POST /api/companies - Create a new company
router.post('/', 
  authenticateToken,  
  validateCreateCompany,
  CompanyController.createCompany
);

// GET /api/companies - Get all companies (with optional filtering)
router.get('/', 
  authenticateToken,
  CompanyController.getAllCompanies
);

// // GET /api/companies/stats - Get company statistics
// router.get('/stats', 
//   CompanyController.getCompanyStats
// );

// GET /api/companies/:id - Get company by ID
router.get('/:id', 
  authenticateToken,
  CompanyController.getCompanyById
);

// PUT /api/companies/:id - Update company
router.put('/:id', 
  authenticateToken,
  validateUpdateCompany,
  CompanyController.updateCompany
);

// DELETE /api/companies/:id - Delete company
router.delete('/:id', 
  authenticateToken,
  // validateCompanyId,
  CompanyController.deleteCompany
);

// GET /api/companies/gst/:gstNo - Get company by GST number
// router.get('/gst/:gstNo', 
//   CompanyController.getCompanyByGstNo
// );

module.exports = router; 