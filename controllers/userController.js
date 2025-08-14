const jwt = require("jsonwebtoken");
const User = require("../models/user");

/**
 * User Controller
 * Contains all business logic for user operations
 */
class UserController {
  /**
   * Generate JWT token
   */
  static generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
  }

  /**
   * Register a new user
   */
  static async register(req, res) {
    try {
      const userData = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists",
        });
      }

      // Create new user
      const newUser = await User.create(userData);

      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: {
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
          },
        },
      });
    } catch (error) {
      console.error("Error creating user:", error);

      // Handle duplicate email error
      if (error.code === "ER_DUP_ENTRY" && error.message.includes("email")) {
        return res.status(400).json({
          success: false,
          message: "A user with this email already exists",
        });
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Something went wrong",
      });
    }
  }

  /**
   * Login user
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      

      // Verify password
      const isPasswordValid = await User.verifyPassword(
        password,
        user.password
      );
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Generate token
      const token = UserController.generateToken(user.id);

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          token,
        },
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Something went wrong",
      });
    }
  }

  /**
   * Get user profile
   */
  static async getProfile(req, res) {
    try {
      const userId = req.user.userId;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        },
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Something went wrong",
      });
    }
  }

  /**
   * Get all users
   */
  // static async getAllUsers(req, res) {
  //   try {
  //     const users = await User.getAll();

  //     res.status(200).json({
  //       success: true,
  //       count: users.length,
  //       data: users,
  //     });
  //   } catch (error) {
  //     console.error("Error fetching users:", error);
  //     res.status(500).json({
  //       success: false,
  //       message: "Internal server error",
  //       error:
  //         process.env.NODE_ENV === "development"
  //           ? error.message
  //           : "Something went wrong",
  //     });
  //   }
  // }

  /**
   * Update user profile
   */
  static async updateProfile(req, res) {
    try {
      const userId = req.user.userId;
      const userData = req.body;

      // Check if user exists
      const existingUser = await User.findById(userId);
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Update the user
      const result = await User.update(userId, userData);

      // If no rows were affected, something went wrong
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found or no changes made",
        });
      }

      // Fetch updated user data
      const updatedUser = await User.findById(userId);

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: {
          user: updatedUser,
        },
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Something went wrong",
      });
    }
  }

  /**
   * Change user password
   */
  static async changePassword(req, res) {
    try {
      const userId = req.user.userId;
      const { currentPassword, newPassword } = req.body;

      // Find user with password for verification
      // We need to get user by ID first, then get the full user data with password
      const userProfile = await User.findById(userId);
      if (!userProfile) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Get user with password using email
      // const user = await User.findByEmail(userProfile.email);
      // if (!user) {
      //   return res.status(404).json({
      //     success: false,
      //     message: "User not found",
      //   });
      // }

      // Verify current password
      const isCurrentPasswordValid = await User.verifyPassword(
        currentPassword,
        userProfile.password
      );
      if (!isCurrentPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      // Update password
      const result = await User.updatePassword(userId, newPassword);

      // If no rows were affected, something went wrong
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Something went wrong",
      });
    }
  }

  /**
   * Delete user by ID
   */
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;

      // Check if user exists
      const existingUser = await User.findById(id);
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Delete the user
      const result = await User.delete(id);

      // If no rows were affected, the user might have been already deleted
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: {
          id: id,
          deletedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Error deleting user:", error);

      // Handle foreign key constraint errors if user has associated records
      if (error.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(400).json({
          success: false,
          message: "Cannot delete user as it has associated records",
        });
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Something went wrong",
      });
    }
  }
}

module.exports = UserController;
