const pool = require("../configs/db.config");
const { getTimestampSeconds } = require("../helpers/dateHelper");
const { v4: uuidv4 } = require("uuid");
const AppError = require("../helpers/errorHelper");

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
    return next(new AppError(`Error creating note: ${error}`, 500));
  }
};

const deleteNoteByID = async (noteID, next) => {
  try {
    const result = await pool.execute(
      "UPDATE notes SET active = 0 WHERE idnotes = ?",
      [noteID]
    );

    if (result[0].affectedRows) return "Note deleted successfully";
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

const updateNoteByID = async (
  idnotes,
  title,
  lecture,
  idcourses,
  content,
  timestamp,
  isPublic,
  idusers,
  next
) => {
  try {
    const updatedAt = getTimestampSeconds();

    const [result] = await pool.query(
      "UPDATE notes SET title = ?, lecture = ?, updatedAt = ?, idcourses = ?, content = ?, timestamp = ?, isPublic = ? WHERE idnotes = ? AND idusers = ?",
      [
        title,
        lecture,
        updatedAt,
        idcourses,
        content,
        timestamp,
        isPublic,
        idnotes,
        idusers,
      ]
    );
    console.log(result);
    if (result.affectedRows) return { message: "Note updated successfully" };
  } catch (error) {
    return next(new AppError(`Error updating note: ${error}`, 500));
  }
};

module.exports = {
  getCourseNotesByUserID,
  getLectureNotes,
  createNote,
  deleteNoteByID,
  updateNoteByID,
};

