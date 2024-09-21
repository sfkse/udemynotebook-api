const {
  getCoursesByUserID,
  createCourseByUserID,
} = require("../models/courseModel");

const getCourseLectures = async (req, res) => {
  const { userID } = req.params;
  const authUser = req.user;

  if (authUser.userID !== userID) {
    return res.status(403).json({
      message: "You are not authorized to access this course",
    });
  }

  try {
    const notes = await getCoursesByUserID(userID);
    return res.status(200).json(notes);
  } catch (error) {
    return res.status(500).json({
      message: `Error in getCourseLectures when fetching lectures: ${error}`,
    });
  }
};

const createCourse = async (req, res) => {
  const { title } = req.body;
  const authUser = req.user;

  if (!title) {
    return res.status(400).json({
      message: "Course title is required",
    });
  }
  console.log("authUser", authUser);
  console.log("title", title);
  try {
    const course = await createCourseByUserID(title, authUser.userID);
    return res.status(201).json(course);
  } catch (error) {
    return res.status(500).json({
      message: `Error in createCourse when creating course: ${error}`,
    });
  }
};

module.exports = {
  getCourseLectures,
  createCourse,
};

