const { v4: uuidv4 } = require("uuid");
const pool = require("../configs/db.config");
const { getTimestampSeconds } = require("../helpers/dateHelper");
const { PLAN_TYPES } = require("../helpers/userHelper");
const AppError = require("../helpers/errorHelper");

const createUser = async (email, password, next) => {
  try {
    const userID = uuidv4();
    const createdAt = getTimestampSeconds();
    const updatedAt = getTimestampSeconds();
    const plan = PLAN_TYPES.FREE;

    const result = await pool.execute(
      "INSERT INTO users (idusers, email, password, createdAt, updatedAt, plan) VALUES (?, ?, ?, ?, ?, ?)",
      [userID, email, password, createdAt, updatedAt, plan]
    );

    if (result[0].affectedRows) return { userID, email, plan };
  } catch (error) {
    throw next(new AppError(`Error when creating user: ${error}`));
  }
};

const getUserById = async (userID, next) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE idusers = ? ", [
      userID,
    ]);

    return result[0][0];
  } catch (error) {
    return next(error);
  }
};

const getSingleUserByEmail = async (email, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = ? and active",
      [email]
    );
    return result[0][0];
  } catch (error) {
    return next(error);
  }
};

const getUserByGoogleID = async (googleID, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE googleID = ? and active",
      [googleID]
    );

    return result[0][0];
  } catch (error) {
    return next(error);
  }
};

const updateUser = async (userID, data, next) => {
  const { firstname, lastname, skills } = data;

  const updated = getTimestampSeconds();
  try {
    const result = await pool.execute(
      "UPDATE users SET firstname=?, lastname=?, skills=?, updated=? WHERE idusers = ?",
      [firstname, lastname, JSON.stringify(skills), updated, userID]
    );

    if (result[0].affectedRows) return true;
    return false;
  } catch (error) {
    return next(error);
  }
};

const storeRefreshToken = async (userId, refreshToken) => {
  const query = "UPDATE users SET refreshToken = ? WHERE idusers = ?";
  await pool.query(query, [refreshToken, userId]);
};

module.exports = {
  getUserById,
  getSingleUserByEmail,
  createUser,
  updateUser,
  getUserByGoogleID,
  storeRefreshToken,
};

