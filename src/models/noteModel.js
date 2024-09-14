const pool = require("../configs/db.config");
const { getTimestampSeconds } = require("../helpers/dateHelper");
const { v4: uuidv4 } = require("uuid");

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

const createNote = async (
  title,
  lecture,
  idcourses,
  content,
  timestamp,
  isPublic,
  idusers,
  next
) => {
  const idnotes = uuidv4();
  const createdAt = getTimestampSeconds();
  const updatedAt = getTimestampSeconds();
  try {
    const result = await pool.execute(
      "INSERT INTO notes (idnotes, createdAt, updatedAt, title, lecture, idcourses, content, timestamp, isPublic, idusers) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        idnotes,
        createdAt,
        updatedAt,
        title,
        lecture,
        idcourses,
        content,
        timestamp,
        isPublic,
        idusers,
      ]
    );

    if (result[0].affectedRows) return "Note created successfully";
  } catch (error) {
    return next(error);
  }
};

const getLectureNotes = async (userID, lectureName, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM notes WHERE idusers = ? and lecture = ? and active",
      [userID, lectureName]
    );

    return result[0];
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getCourseNotesByUserID,
  getLectureNotes,
  createNote,
};

