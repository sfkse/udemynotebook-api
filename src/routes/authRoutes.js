const express = require("express");
const router = express.Router();

const {
  handleRegisterUser,
  handleLoginUser,
  handleRenewToken,
} = require("../controllers/authController");

router.post("/register", handleRegisterUser);
router.post("/login", handleLoginUser);
router.post("/renewToken", handleRenewToken);

module.exports = router;

