const AppError = require("../helpers/errorHelper");
const {
  getCourseNotesByUserID,
  createNote,
  getLectureNotes,
  deleteNoteByID,
  updateNoteByID, // Add this import
} = require("../models/noteModel");

const getUserCourseNotes = async (req, res, next) => {
  const { courseID, userID } = req.query;

  try {
    const notes = await getCourseNotesByUserID(userID, courseID, next);

    return res.status(200).json(notes);
  } catch (error) {
    return next(
      new AppError(`Error in getUserNotes when fetching notes: ${error}`)
    );
  }
};

const createLectureNote = async (req, res, next) => {
  const { title, lecture, idcourses, content, timestamp, isPublic, idusers } =
    req.body;
  console.log(title, lecture, idcourses, content, timestamp, isPublic, idusers);
  try {
    const response = await createNote(
      title,
      lecture,
      idcourses,
      content,
      timestamp,
      isPublic,
      idusers,
      next
    );

    return res.status(200).json(response);
  } catch (error) {
    return next(
      new AppError(`Error in createLectureNote when creating notes: ${error}`)
    );
  }
};

const removeNote = async (req, res, next) => {
  const { noteID } = req.query;

  try {
    const response = await deleteNoteByID(noteID, next);

    return res.status(200).json(response);
  } catch (error) {
    return next(
      new AppError(`Error in removeNote when deleting notes: ${error}`)
    );
  }
};

const getNotesByLectureName = async (req, res, next) => {
  const { lectureName, userID } = req.query;

  try {
    const notes = await getLectureNotes(userID, lectureName, next);

    return res.status(200).json(notes);
  } catch (error) {
    return next(
      new AppError(
        `Error in getNotesByLectureName when fetching notes: ${error}`
      )
    );
  }
};

const updateNote = async (req, res, next) => {
  const {
    idnotes,
    title,
    lecture,
    idcourses,
    content,
    timestamp,
    isPublic,
    idusers,
  } = req.body;
  console.log(req.body);
  try {
    const response = await updateNoteByID(
      idnotes,
      title,
      lecture,
      idcourses,
      content,
      timestamp,
      isPublic,
      idusers,
      next
    );

    return res.status(200).json(response);
  } catch (error) {
    return next(
      new AppError(`Error in updateNote when updating note: ${error}`)
    );
  }
};

module.exports = {
  getUserCourseNotes,
  getNotesByLectureName,
  createLectureNote,
  removeNote,
  updateNote, // Add this export
};

