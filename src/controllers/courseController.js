const AppError = require("../helpers/errorHelper");
const { getCoursesByUserID } = require("../models/courseModel");

const getCourseLectures = async (req, res, next) => {
  const { userID } = req.params;

  try {
    const notes = await getCoursesByUserID(userID, next);
    return res.status(200).json(notes);
  } catch (error) {
    return next(
      new AppError(
        `Error in getCourseLectures when fetching lectures: ${error}`
      )
    );
  }
};

module.exports = {
  getCourseLectures,
};

