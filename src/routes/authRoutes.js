const express = require("express");
const router = express.Router();

const {
  handleRegisterUser,
  handleLoginUser,
} = require("../controllers/authController");

router.post("/register", handleRegisterUser);
router.post("/login", handleLoginUser);

module.exports = router;

