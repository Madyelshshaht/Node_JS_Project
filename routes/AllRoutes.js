const express = require('express');
const router = express.Router();
const moment = require('moment');
const bcrypt = require("bcryptjs");
const LoginData = require('../models/loginSchema');

// Model Schema
const UserData = require('../models/UserSchema');
const { getUsers, getAddPage, getEditPage, getViewPage, addUser, searchUser, editUser, deleteUser, get_login_page, get_register_page, get_profile_page, logout, LoginUser, RegisterUser } = require('../controllers/userController');



// -------------------- GET ---------------------
router.get('/', getUsers);

router.get('/user/add.html', getAddPage)

router.get('/user/edit/:id', getEditPage)

router.get('/user/view/:id', getViewPage);

// =================== POST ========================

// Edit Users 
router.post("/user/add.html", addUser)

// Search 
router.post("/search", searchUser)

// ====================== PUT ========================
// Edit User
router.put("/user/edit/:id", editUser);

// ====================== DELETE =====================
// Delete User
router.delete("/user/delete/:id", deleteUser);



// ====================== Login ============================== //

router.get("/login", get_login_page)
router.get("/register", get_register_page);
router.get("/profile", get_profile_page);
router.get("/logout", logout);


// Register
router.post("/register", RegisterUser)


router.post("/login", LoginUser);

module.exports = router;