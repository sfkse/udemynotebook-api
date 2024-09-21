const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { getSingleUserByEmail, createUser } = require("../models/userModel");

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const SALT_ROUNDS = 10;

const handleLoginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await getSingleUserByEmail(email, next);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userID: user.idusers }, JWT_ACCESS_SECRET, {
      expiresIn: "1d",
    });
    res.json({ userID: user.idusers, email: user.email, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const handleRegisterUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const existingUser = await getSingleUserByEmail(email, next);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await createUser(email, hashedPassword, next);

    const token = jwt.sign({ userId: newUser.idusers }, JWT_ACCESS_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({ userID: newUser.idusers, email, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  handleLoginUser,
  handleRegisterUser,
};

