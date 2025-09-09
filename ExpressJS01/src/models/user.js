const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'User' },
    address: { type: String },
    phone: { type: String },
    age: { type: Number },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    province: { type: String },
}, { timestamps: true });

const User = mongoose.model('user', userSchema);

module.exports = User;
