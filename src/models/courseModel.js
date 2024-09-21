const pool = require("../configs/db.config");
const { v4: uuidv4 } = require("uuid");
const { getTimestampSeconds } = require("../helpers/dateHelper");

const getCoursesByUserID = async (userID) => {
  const result = await pool.query(
    "SELECT * FROM courses WHERE idusers = ? and active",
    [userID]
  );

  return result[0];
};

const createCourseByUserID = async (title, userID) => {
  const idcourses = uuidv4();
  const createdAt = getTimestampSeconds();
  const updatedAt = getTimestampSeconds();

  const result = await pool.query(
    "INSERT INTO courses (idcourses, createdAt, updatedAt, title, idusers) VALUES (?, ?, ?, ?, ?)",
    [idcourses, createdAt, updatedAt, title, userID]
  );

  if (result[0].affectedRows === 1) {
    const createdCourse = await getCoursesByUserID(userID);
    return createdCourse[0];
  }
};

module.exports = {
  getCoursesByUserID,
  createCourseByUserID,
};

