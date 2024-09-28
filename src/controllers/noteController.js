const {
  getCourseNotesByUserID,
  createNote,
  getLectureNotes,
  deleteNoteByID,
  updateNoteByID,
  getCourseCommunityNotes, // Add this import
} = require("../models/noteModel");

const getUserCourseNotes = async (req, res, next) => {
  const { courseID, userID } = req.query;
  const authUser = req.user;

  if (authUser !== userID) {
    return res.status(403).json({
      status: "error",
      message: "You are not authorized to access this course",
    });
  }

  try {
    const notes = await getCourseNotesByUserID(userID, courseID, next);

    return res.status(200).json(notes);
  } catch (error) {
    return res.status(403).json({
      status: "error",
      message: `Error in getUserCourseNotes when fetching notes: ${error}`,
    });
  }
};

const createLectureNote = async (req, res) => {
  const { title, lecture, idcourses, content, timestamp, isPublic, idusers } =
    req.body;
  const authUser = req.user;

  if (authUser !== idusers) {
    return res.status(403).json({
      status: "error",
      message: "You are not authorized to access this course",
    });
  }

  try {
    const response = await createNote(
      title,
      lecture,
      idcourses,
      content,
      timestamp,
      isPublic,
      idusers
    );

    return res.status(200).json(response);
  } catch (error) {
    return res.status(403).json({
      status: "error",
      message: `Error in createLectureNote when creating notes: ${error}`,
    });
  }
};

const removeNote = async (req, res) => {
  const { noteID, userID } = req.query;
  const authUser = req.user;

  if (authUser !== userID) {
    return res.status(403).json({
      status: "error",
      message: "You are not authorized to perform this action",
    });
  }

  try {
    const response = await deleteNoteByID(noteID);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(403).json({
      status: "error",
      message: `Error in removeNote when deleting notes: ${error}`,
    });
  }
};

const getNotesByLectureName = async (req, res, next) => {
  const { lectureName, userID } = req.query;
  const authUser = req.user;

  if (authUser !== userID) {
    return res.status(403).json({
      status: "error",
      message: "You are not authorized to access this course",
    });
  }

  try {
    const notes = await getLectureNotes(userID, lectureName, next);

    return res.status(200).json(notes);
  } catch (error) {
    return res.status(403).json({
      status: "error",
      message: `Error in getNotesByLectureName when fetching notes: ${error}`,
    });
  }
};

const updateNote = async (req, res) => {
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
  const authUser = req.user;

  if (authUser !== idusers) {
    return res.status(403).json({
      status: "error",
      message: "You are not authorized to access this course",
    });
  }

  try {
    const response = await updateNoteByID(
      idnotes,
      title,
      lecture,
      idcourses,
      content,
      timestamp,
      isPublic,
      idusers
    );

    return res.status(200).json(response);
  } catch (error) {
    return res.status(403).json({
      status: "error",
      message: `Error in updateNote when updating note: ${error}`,
    });
  }
};

const getCommunityNotesByCourse = async (req, res) => {
  const { courseID } = req.query;

  try {
    const notes = await getCourseCommunityNotes(courseID);

    return res.status(200).json(notes);
  } catch (error) {
    return res.status(403).json({
      status: "error",
      message: `Error in getCourseCommunityNotes when fetching notes: ${error}`,
    });
  }
};

module.exports = {
  getUserCourseNotes,
  getCommunityNotesByCourse,
  getNotesByLectureName,
  createLectureNote,
  removeNote,
  updateNote, // Add this export
};

