const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authToken = req.headers.authtoken;
//   const token = authToken && authToken.split(" ")[1]; // Bearer TOKEN
//   console.log(token);

  if (!authToken) {
    return res.status(401).json({
      success: false,
      message: "Access token required",
    });
  }

  jwt.verify(
    authToken,
    process.env.JWT_SECRET || "your-secret-key",
    (err, user) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Invalid or expired token",
        });
      }

      req.user = user;
      next();
    }
  );
};

module.exports = {
  authenticateToken,
};
