const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const { authenticateToken } = require("../middlewares/auth");
const {
  validateUserRegister,
  validateUserLogin,
  validateUserUpdateProfile,
  validateUserChangePassword,
} = require("../middlewares/validate");

// Register a new user
router.post("/register", validateUserRegister, UserController.register);

// Login user
router.post("/login", validateUserLogin, UserController.login);

// Get user profile (protected route)
router.get("/profile", authenticateToken, UserController.getProfile);

// Update user profile (protected route)
router.put(
  "/profile",
  authenticateToken,
  validateUserUpdateProfile,
  UserController.updateProfile
);

// Change password (protected route)
router.put(
  "/change-password",
  authenticateToken,
  validateUserChangePassword,
  UserController.changePassword
);

// Get all users (protected route)
// router.get("/users", authenticateToken, UserController.getAllUsers);

// Delete user by ID (protected route)
router.delete("/:id", authenticateToken, UserController.deleteUser);

module.exports = router;
