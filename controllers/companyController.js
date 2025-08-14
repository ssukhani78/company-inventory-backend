const Company = require('../models/company');

/**
 * Company Controller
 * Contains all business logic for company operations
 */
class CompanyController {
  
  /**
   * Create a new company
   */
  static async createCompany(req, res) {
    try {
      const companyData = req.body;

      const existingCompany = await Company.findByGstNo(companyData.gstNo);

      if (existingCompany) {
        return res.status(400).json({
          success: false,
          message: 'A company with this GST number already exists'
        });
      }

      const newCompany = await Company.create(companyData);
      
      res.status(201).json({
        success: true,
        message: 'Company created successfully',
        data: newCompany
      });
    } catch (error) {
      console.error('Error creating company:', error);
      
      // Handle duplicate email error
      if (error.code === 'ER_DUP_ENTRY' && error.message.includes('email')) {
        return res.status(400).json({
          success: false,
          message: 'A company with this email already exists'
        });
      }
      
      // Handle duplicate GST number error
      if (error.code === 'ER_DUP_ENTRY' && error.message.includes('gstNo')) {
        return res.status(400).json({
          success: false,
          message: 'A company with this GST number already exists'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    }
  }

  /**
   * Get all companies with optional filtering and pagination
   */
  static async getAllCompanies(req, res) {
    try {
      // const { page = 1, limit = 10, search, city, state, status } = req.query;
      
      // Build filter object
      // const filters = {};
      // if (search) filters.search = search;
      // if (city) filters.city = city;
      // if (state) filters.state = state;
      // if (status !== undefined) filters.status = status;
      
      const companies = await Company.getAll();
      
      res.status(200).json({
        success: true,
        count: companies.length,
        data: companies
      });
    } catch (error) {
      console.error('Error fetching companies:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    }
  }

  /**
   * Get company by ID
   */
  static async getCompanyById(req, res) {
    try {
      const { id } = req.params;
      const company = await Company.getById(id);
      
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Company not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: company
      });
    } catch (error) {
      console.error('Error fetching company:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    }
  }

  /**
   * Update company by ID
   */
  static async updateCompany(req, res) {
    try {
      const { id } = req.params;
      const companyData = req.body;
      
      // Check if company exists
      const existingCompany = await Company.getById(id);
      if (!existingCompany) {
        return res.status(404).json({
          success: false,
          message: 'Company not found'
        });
      }
      
      // Update the company
      const result = await Company.update(id, companyData);
      
      // If no rows were affected, the company might have been deleted
      if (result.affectedRows === 0) {
        return res.status(200).json({
          success: true,
          message: 'No changes made'
        });
      }
      
      // Fetch updated company data
      const updatedCompany = await Company.getById(id);
      
      res.status(200).json({
        success: true,
        message: 'Company updated successfully',
        data: updatedCompany
      });
    } catch (error) {
      console.error('Error updating company:', error);
      
      // Handle duplicate email error
      if (error.code === 'ER_DUP_ENTRY' && error.message.includes('email')) {
        return res.status(400).json({
          success: false,
          message: 'A company with this email already exists'
        });
      }
      
      // Handle duplicate GST number error
      if (error.code === 'ER_DUP_ENTRY' && error.message.includes('gstNo')) {
        return res.status(400).json({
          success: false,
          message: 'A company with this GST number already exists'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    }
  }

  /**
   * Delete company by ID
   */
  static async deleteCompany(req, res) {
    try {
      const { id } = req.params;
      
      // Check if company exists
      const existingCompany = await Company.getById(id);
      if (!existingCompany) {
        return res.status(404).json({
          success: false,
          message: 'Company not found'
        });
      }
      
      // Delete the company
      const result = await Company.delete(id);
      
      // If no rows were affected, the company might have been already deleted
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Company not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Company deleted successfully',
        data: {
          id: id,
          deletedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error deleting company:', error);
      
      // Handle foreign key constraint errors
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete company as it has associated records (sales, etc.)'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    }
  }

  /**
   * Get company statistics
   */
  static async getCompanyStats(req, res) {
    try {
      const stats = await Company.getStats();
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching company statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    }
  }

  /**
   * Bulk operations for companies
   */
  static async bulkDeleteCompanies(req, res) {
    try {
      const { ids } = req.body;
      
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Please provide an array of company IDs'
        });
      }
      
      const result = await Company.bulkDelete(ids);
      
      res.status(200).json({
        success: true,
        message: `${result.deletedCount} companies deleted successfully`,
        data: {
          deletedCount: result.deletedCount,
          failedIds: result.failedIds
        }
      });
    } catch (error) {
      console.error('Error in bulk delete:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    }
  }
}

module.exports = CompanyController; 