const pool = require("../configs/db.config");

const getCourseNotesByUserID = async (userID, courseID, next) => {
  try {
    // const result = await pool.query(
    //   "SELECT n.idnotes, n.title, n.content, n.timestamp, n.isPublic, l.idlectures, l.title FROM notes n JOIN lectures l ON n.idlectures = l.idlectures WHERE l.idusers=? and l.idlectures=? and l.active=1",
    //   [userID, courseID]
    // );
    const result = await pool.query(
      "SELECT * FROM notes WHERE idusers = ? and idcourses = ? and active",
      [userID, courseID]
    );

    return result[0];
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getCourseNotesByUserID,
};

