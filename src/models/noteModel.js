const pool = require("../configs/db.config");
const { getTimestampSeconds } = require("../helpers/dateHelper");
const { v4: uuidv4 } = require("uuid");

const getCourseNotesByUserID = async (userID, courseID) => {
  const result = await pool.query(
    "SELECT * FROM notes WHERE idusers = ? and idcourses = ? and active",
    [userID, courseID]
  );

  return result[0];
};

const createNote = async (
  title,
  lecture,
  idcourses,
  content,
  timestamp,
  isPublic,
  idusers
) => {
  const idnotes = uuidv4();
  const createdAt = getTimestampSeconds();
  const updatedAt = getTimestampSeconds();

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
};

const deleteNoteByID = async (noteID) => {
  const result = await pool.execute(
    "UPDATE notes SET active = 0 WHERE idnotes = ?",
    [noteID]
  );

  if (result[0].affectedRows) return "Note deleted successfully";
};

const getLectureNotes = async (userID, lectureName) => {
  const result = await pool.query(
    "SELECT * FROM notes WHERE idusers = ? and lecture = ? and active",
    [userID, lectureName]
  );

  return result[0];
};

const updateNoteByID = async (
  idnotes,
  title,
  lecture,
  idcourses,
  content,
  timestamp,
  isPublic,
  idusers
) => {
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

  if (result.affectedRows) return { message: "Note updated successfully" };
};

const getCourseCommunityNotes = async (courseID) => {
  const result = await pool.query(
    "SELECT * FROM notes WHERE idcourses = ? and active",
    [courseID]
  );

  return result[0];
};

module.exports = {
  getCourseNotesByUserID,
  getLectureNotes,
  getCourseCommunityNotes,
  createNote,
  deleteNoteByID,
  updateNoteByID,
};

