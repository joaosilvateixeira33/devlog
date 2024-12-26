const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Modelo de Usuário
const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true,
    maxlength: [8, 'O nome de usuário deve ter no máximo 8 caracteres'],
  },
  email: { type: String, required: true, unique: true },
  password: { 
    type: String, 
    required: true,
    maxlength: [8, 'A senha deve conter no maximo 8 caracteres']
  },
  role: { type: String, default: "user" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);
