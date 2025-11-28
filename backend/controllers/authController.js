require("dotenv").config();
const { student } = require("../models/stdModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingStudent = await student.findOne({ email });
    if (existingStudent) {
      return res.status(409).json({
        success: false,
        msg: "Email already registered",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const std = await student.create({ name, email, password: hashedPassword });
    return res.status(201).json({
      success: true,
      msg: "Registration successful",
      data: { id: std._id, email: std.email, name: std.name },
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({
      success: false,
      msg: "Registration failed. Please try again.",
    });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const std = await student.findOne({ email }).select('+password');
    if (!std) {
      return res.status(404).json({
        success: false,
        msg: "Account not found. Please register first.",
      });
    }
    const isMatch = await bcrypt.compare(password, std.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        msg: "Invalid email or password",
      });
    }
    const payload = {
      id: std._id,
      email: std.email,
      role: std.role || 'user',
    };
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      msg: "Login successful",
      data: { id: std._id, email: std.email, name: std.name, role: std.role || 'user' },
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      msg: "Login failed. Please try again.",
    });
  }
};
const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    res.status(200).json({
      success: true,
      msg: "Logged out successfully",
    });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({
      success: false,
      msg: "Logout failed",
    });
  }
};
module.exports = { register, login, logout };
