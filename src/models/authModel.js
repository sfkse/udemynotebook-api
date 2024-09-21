const pool = require("../configs/db.config");

const registerUser = async (email, password, next) => {
  try {
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, password]
    );

    return result[0];
  } catch (error) {
    return next(error);
  }
};

const loginUser = async (email, password, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = ? and password = ?",
      [email, password]
    );
    return result[0];
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
