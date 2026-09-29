const express = require('express');
const router = express.Router();
const moment = require('moment');

// Model Schema
const UserData = require('../models/UserSchema');
const { getUsers, getAddPage, getEditPage, getViewPage, addUser, searchUser, editUser, deleteUser } = require('../controllers/userController');



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





module.exports = router;