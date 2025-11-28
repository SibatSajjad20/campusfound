require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const validateMW = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return res.status(400).json({
      message: `Validation error: ${errorMessage}`,
    });
  }
  next();
};

const protectRoute = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      msg: "Access Denied, Please Login",
      isLoggedIn: false,
    });
  }
  try {
    const verifyToken = jwt.verify(token, JWT_SECRET);
    req.std = verifyToken;
    req.user = verifyToken; // Alias for consistency
    next();
  } catch (err) {
    return res.status(401).json({
      msg: "invalid or expired token.",
      isLoggedIn: false,
    });
  }
};
module.exports = { validateMW,protectRoute };
