const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  getSingleUserByEmail,
  createUser,
  storeRefreshToken,
  getUserById,
} = require("../models/userModel");

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const SALT_ROUNDS = 10;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET; // Add this to your .env file

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

    const accessToken = jwt.sign({ userID: user.idusers }, JWT_ACCESS_SECRET, {
      expiresIn: "15m", // Short-lived access token
    });

    const refreshToken = jwt.sign(
      { userID: user.idusers },
      JWT_REFRESH_SECRET,
      {
        expiresIn: "7d", // Long-lived refresh token
      }
    );

    // Store the refresh token in the database
    await storeRefreshToken(user.idusers, refreshToken);

    res.json({
      userID: user.idusers,
      email: user.email,
      accessToken,
      refreshToken,
    });
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

    const token = jwt.sign({ userID: newUser.idusers }, JWT_ACCESS_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({ userID: newUser.idusers, email, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const handleRenewToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = await getUserById(decoded.userID);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { userID: user.idusers },
      JWT_ACCESS_SECRET,
      {
        expiresIn: "15m",
      }
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Refresh token expired" });
    }
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

module.exports = {
  handleLoginUser,
  handleRegisterUser,
  handleRenewToken,
};

