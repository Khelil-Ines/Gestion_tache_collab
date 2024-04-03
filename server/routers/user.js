const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const auth=require('../middleware/auth')

router.post("/signup", userController.signup);
router.patch('/users/profile', auth.loggedMiddleware, userController.updateUserProfile);
router.post("/login", userController.login);
router.get("/getU", userController.getUser);


module.exports = router;