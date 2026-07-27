const express = require("express");
const { userCreation,getuser, deleteAllUsersService, deleteUserService, searchUsers } = require("../controllers/userController");
const router = express.Router();

router.post("/user",userCreation);
router.get("/user",getuser);
router.delete("/user",deleteAllUsersService);
router.delete("/user/:id",deleteUserService);
router.get("/search", searchUsers);

module.exports= router; 