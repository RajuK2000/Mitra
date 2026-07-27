const express = require("express");
const Loginuser = require("../services/loginuser");
const router = express.Router();
    
router.post("/login",Loginuser);

module.exports = router