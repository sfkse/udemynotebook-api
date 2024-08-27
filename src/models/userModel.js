const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const pool = require("../configs/db.config");
const AppError = require("../helpers/errorHelper");
const { getTimestampSeconds } = require("../helpers/dateHelper");
const { PLAN_TYPES } = require("../helpers/userHelper");
const e = require("express");

const createUser = async (userData, next) => {
  try {
    const { email, googleID } = userData;
    // Check if user already exists
    const userExists = await getSingleUserByEmail(email, next);
    if (userExists.length > 0) {
      return next(new AppError("User already exists", 409));
    }

    const userID = uuidv4();
    const createdAt = getTimestampSeconds();
    const updatedAt = getTimestampSeconds();
    const plan = PLAN_TYPES.FREE;

    const result = await pool.execute(
      "INSERT INTO users (idusers, googleId, email, createdAt, updatedAt, plan) VALUES (?, ?, ?, ?, ?, ?)",
      [userID, googleID, email, createdAt, updatedAt, plan]
    );

    if (result[0].affectedRows) return await getSingleUserByEmail(email, next);
    else return next(new AppError("Error when fetching user from db"));
  } catch (error) {
    throw next(error);
  }
};

const getUserById = async (userID, next) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE idusers = ? ", [
      userID,
    ]);

    const response = result[0].map((user) => ({
      ...user,
    }));

    return response;
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
    return result[0];
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

module.exports = {
  getUserById,
  getSingleUserByEmail,
  createUser,
  updateUser,
};

