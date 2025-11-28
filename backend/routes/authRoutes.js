const express = require("express");
const { register, login, logout } = require("../controllers/authController");
const { validateMW } = require("../middlewares/authmw");
const { registerSchema, loginSchema } = require("../validation/validationSchemas");
const { authLimiter } = require("../middlewares/rateLimiter");
const authRouter = express.Router();

// Apply rate limiting to all auth routes
authRouter.use(authLimiter);

authRouter.post("/register", validateMW(registerSchema), register);
authRouter.post("/login", validateMW(loginSchema), login);
authRouter.post("/logout", logout);

module.exports = { authRouter };
