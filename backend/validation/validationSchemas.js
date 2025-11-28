const joi = require("joi");

const registerSchema = joi.object({
  name: joi.string().min(2).max(50).trim().required(),
  email: joi.string().email().lowercase().trim().required(),
  password: joi.string().min(6).max(128).required(),
});

const loginSchema = joi.object({
  email: joi.string().email().lowercase().trim().required(),
  password: joi.string().min(6).max(128).required(),
});

const itemSchema = joi.object({
  title: joi.string().min(3).max(100).trim().required(),
  description: joi.string().min(10).max(1000).trim().required(),
  category: joi.string().min(2).max(50).trim().required(),
  location: joi.string().min(3).max(200).trim().required(),
  date: joi.date().max('now').required(),
  type: joi.string().valid('lost', 'found').required(),
});

module.exports = { registerSchema, loginSchema, itemSchema };

