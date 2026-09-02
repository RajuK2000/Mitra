const express = require("express");
const LogoutServer = require("../services/userlogoutservice");
const router = express()

router.post("/logout", LogoutServer);

module.exports = router;