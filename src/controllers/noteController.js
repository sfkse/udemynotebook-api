const AppError = require("../helpers/errorHelper");
const { getCourseNotesByUserID } = require("../models/noteModel");

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

module.exports = {
  getUserCourseNotes,
};

