const Joi = require("joi");

/**
 * Generic validation middleware factory
 * @param {Object} schema - Joi validation schema
 * @param {string} property - Request property to validate ('body', 'params', 'query')
 */
const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: true, // Stop at first validation error
      allowUnknown: false, // Don't allow unknown fields
      stripUnknown: true, // Remove unknown fields
    });

    if (error) {
      // Get only the first error
      const firstError = error.details[0];

      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: {
          field: firstError.path.join("."),
          message: firstError.message,
          value: firstError.context.value,
        },
      });
    }

    // Replace the original property with validated and sanitized data
    req[property] = value;
    next();
  };
};

// Company validation schemas
const companySchemas = {
  // Schema for creating a new company
  create: Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      "string.min": "Company name must be at least 2 characters long",
      "string.max": "Company name must not exceed 100 characters",
      "any.required": "Company name is required",
    }),

    gstNo: Joi.string()
      .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
      .required()
      .messages({
        "string.pattern.base":
          "GST number must be in valid format (e.g., 27ABCDE1234F1Z5)",
      }),

    email: Joi.string().email().max(100).allow(null, "").optional().messages({
      "string.email": "Please provide a valid email address",
      "string.max": "Email must not exceed 100 characters",
    }),

    phone: Joi.string()
      .pattern(/^(\+\d{2}[0-9]{10}|[0-9]{10})$/)
      .max(13)
      .allow(null, "")
      .optional()
      .messages({
        "string.pattern.base": "Please provide a valid phone number",
      }),

    address: Joi.string().max(500).required().messages({
      "string.max": "Address must not exceed 500 characters",
    }),

    city: Joi.string().min(2).max(50).required().messages({
      "string.min": "City must be at least 2 characters long",
      "string.max": "City must not exceed 50 characters",
    }),

    state: Joi.string().min(2).max(50).required().messages({
      "string.min": "State must be at least 2 characters long",
      "string.max": "State must not exceed 50 characters",
    }),

    pincode: Joi.string()
      .pattern(/^[1-9][0-9]{5}$/)
      .required()
      .messages({
        "string.pattern.base":
          "Pincode must be a valid 6-digit Indian postal code",
      }),

    status: Joi.string().valid("active", "inactive").required().messages({
      "any.only": "Status must be either active or inactive",
    }),
  }),

  // Schema for updating a company (all fields optional except validation rules)
  update: Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      "string.min": "Company name must be at least 2 characters long",
      "string.max": "Company name must not exceed 100 characters",
    }),

    gstNo: Joi.string()
      .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
      .required()
      .messages({
        "string.pattern.base":
          "GST number must be in valid format (e.g., 27ABCDE1234F1Z5)",
      }),

    email: Joi.string().email().max(100).allow(null, "").optional().messages({
      "string.email": "Please provide a valid email address",
      "string.max": "Email must not exceed 100 characters",
    }),

    phone: Joi.string()
      .pattern(/^(\+\d{2}[0-9]{10}|[0-9]{10})$/)
      .allow(null, "")
      .max(13)
      .optional()
      .messages({
        "string.pattern.base": "Please provide a valid phone number",
      }),

    address: Joi.string().max(500).required().messages({
      "string.max": "Address must not exceed 500 characters",
    }),

    city: Joi.string().min(2).max(50).required().messages({
      "string.min": "City must be at least 2 characters long",
      "string.max": "City must not exceed 50 characters",
    }),

    state: Joi.string().min(2).max(50).required().messages({
      "string.min": "State must be at least 2 characters long",
      "string.max": "State must not exceed 50 characters",
    }),

    pincode: Joi.string()
      .pattern(/^[1-9][0-9]{5}$/)
      .required()
      .messages({
        "string.pattern.base":
          "Pincode must be a valid 6-digit Indian postal code",
      }),

    status: Joi.string().valid("active", "inactive").required().messages({
      "any.only": "Status must be either active or inactive",
    }),
  })
    .min(1)
    .messages({
      "object.min": "At least one field must be provided for update",
    }),

  // Schema for validating ID parameter
  params: {
    id: Joi.object({
      id: Joi.string().required().messages({
        "any.required": "Company ID is required",
        "string.empty": "Company ID cannot be empty",
      }),
    }),
  },
};

// Item validation schemas
const itemSchemas = {
  // Schema for creating a new item
  create: Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      "string.min": "Item name must be at least 2 characters long",
      "string.max": "Item name must not exceed 100 characters",
      "any.required": "Item name is required",
    }),

    description: Joi.string().max(500).optional().allow(null, "").messages({
      "string.max": "Description must not exceed 500 characters",
    }),

    hsnCode: Joi.string().min(2).max(10).required().messages({
      "string.min": "HSN code must be at least 2 characters long",
      "string.max": "HSN code must not exceed 10 characters",
      "any.required": "HSN code is required",
    }),

    status: Joi.string().valid("active", "inactive").required().messages({
      "any.only": "Status must be either active or inactive",
    }),
  }),

  // Schema for updating an item (all fields optional except validation rules)
  update: Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      "string.min": "Item name must be at least 2 characters long",
      "string.max": "Item name must not exceed 100 characters",
    }),

    description: Joi.string().max(500).allow(null,'').optional().messages({
      "string.max": "Description must not exceed 500 characters",
    }),

    hsnCode: Joi.string().min(2).max(10).optional().messages({
      "string.min": "HSN code must be at least 2 characters long",
      "string.max": "HSN code must not exceed 10 characters",
    }),

    status: Joi.string().valid("active", "inactive").optional().messages({
      "any.only": "Status must be either active or inactive",
    }),
  })
    .min(1)
    .messages({
      "object.min": "At least one field must be provided for update",
    }),

  // Schema for validating ID parameter
  params: {
    id: Joi.object({
      id: Joi.string().required().messages({
        "any.required": "Item ID is required",
        "string.empty": "Item ID cannot be empty",
      }),
    }),
  },
};

// User validation schemas
const userSchemas = {
  // Schema for user registration
  register: Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name must not exceed 100 characters",
      "string.empty": "Name cannot be empty",
      "any.required": "Name is required",
    }),

    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "string.empty": "Email cannot be empty",
      "any.required": "Email is required",
    }),

    password: Joi.string().min(6).max(128).required().messages({
      "string.min": "Password must be at least 6 characters long",
      "string.max": "Password must not exceed 128 characters",
      "string.empty": "Password cannot be empty",
      "any.required": "Password is required",
    }),
  }),

  // Schema for user login
  login: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "string.empty": "Email cannot be empty",
      "any.required": "Email is required",
    }),

    password: Joi.string().required().messages({
      "string.empty": "Password cannot be empty",
      "any.required": "Password is required",
    }),
  }),

  // Schema for updating user profile
  updateProfile: Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name must not exceed 100 characters",
      "string.empty": "Name cannot be empty",
      "any.required": "Name is required",
    }),
  }),

  // Schema for changing password
  changePassword: Joi.object({
    currentPassword: Joi.string().required().messages({
      "string.empty": "Current password cannot be empty",
      "any.required": "Current password is required",
    }),

    newPassword: Joi.string().min(6).max(128).required().messages({
      "string.min": "New password must be at least 6 characters long",
      "string.max": "New password must not exceed 128 characters",
      "string.empty": "New password cannot be empty",
      "any.required": "New password is required",
    }),
  }),
};

// Export validation middleware functions
module.exports = {
  validate,

  // Company validation middleware
  validateCreateCompany: validate(companySchemas.create, "body"),
  validateUpdateCompany: validate(companySchemas.update, "body"),
  validateCompanyId: validate(companySchemas.params.id, "params"),

  // Item validation middleware
  validateCreateItem: validate(itemSchemas.create, "body"),
  validateUpdateItem: validate(itemSchemas.update, "body"),
  validateItemId: validate(itemSchemas.params.id, "params"),

  // User validation middleware
  validateUserRegister: validate(userSchemas.register, "body"),
  validateUserLogin: validate(userSchemas.login, "body"),
  validateUserUpdateProfile: validate(userSchemas.updateProfile, "body"),
  validateUserChangePassword: validate(userSchemas.changePassword, "body"),

  // Raw schemas for reuse
  schemas: {
    company: companySchemas,
    item: itemSchemas,
    user: userSchemas,
  },
};
