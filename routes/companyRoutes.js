const express = require('express');
const router = express.Router();

// Import controller and validation middleware
const CompanyController = require('../controllers/companyController');
const { 
  validateCreateCompany, 
  validateUpdateCompany, 
  validateCompanyId 
} = require('../middlewares/validate');

/**
 * Company Routes
 * Clean routes that only define endpoints and call controllers
 */

// POST /api/companies - Create a new company
router.post('/', 
  validateCreateCompany,
  CompanyController.createCompany
);

// GET /api/companies - Get all companies (with optional filtering)
router.get('/', 
  CompanyController.getAllCompanies
);

// // GET /api/companies/stats - Get company statistics
// router.get('/stats', 
//   CompanyController.getCompanyStats
// );

// GET /api/companies/:id - Get company by ID
router.get('/:id', 
  validateCompanyId,
  CompanyController.getCompanyById
);

// PUT /api/companies/:id - Update company
router.put('/:id', 
  validateCompanyId,
  validateUpdateCompany,
  CompanyController.updateCompany
);

// DELETE /api/companies/:id - Delete company
router.delete('/:id', 
  validateCompanyId,
  CompanyController.deleteCompany
);

// GET /api/companies/gst/:gstNo - Get company by GST number
// router.get('/gst/:gstNo', 
//   CompanyController.getCompanyByGstNo
// );

module.exports = router; 