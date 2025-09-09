const express = require('express');
const { createUser, handleLogin, getUser, getAccount, searchUsers } = require('../controllers/userController');
const auth = require('../middleware/auth');

const routerAPI = express.Router();

// Các routes không cần xác thực token
routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);

// Các routes cần xác thực token
// Route mới cho tìm kiếm, đặt trước route GET /user
routerAPI.get("/user/search", auth, searchUsers);
routerAPI.get("/user", auth, getUser); // Giữ lại route cũ để lấy tất cả user (phân trang)
routerAPI.get("/account", auth, getAccount);

module.exports = routerAPI;
