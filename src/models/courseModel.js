const pool = require("../configs/db.config");

const getCoursesByUserID = async (userID, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM courses WHERE idusers = ? and active",
      [userID]
    );

    return result[0];
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getCoursesByUserID,
};

