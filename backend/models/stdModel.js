const mongoose = require("mongoose");
const studentSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
});
const student = mongoose.model("Student", studentSchema);
module.exports = { student };
