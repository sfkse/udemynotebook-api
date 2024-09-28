const {
  getUserCourseByCourseId,
  createCourseByIdentifierAndAddUser,
  getCourseByIdentifier,
  addUserCourse,
  getSingleUserCourseExpanded,
  getUserCoursesExpanded,
} = require("../models/courseModel");

const getCourses = async (req, res) => {
  const { identifier } = req.params;

  try {
    const course = await getCourseByIdentifier(identifier);
    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({
      message: `Error in getCourses when fetching lectures: ${error}`,
    });
  }
};

const getUserCourses = async (req, res) => {
  const { idusers } = req.params;

  try {
    const courses = await getUserCoursesExpanded(idusers);
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({
      message: `Error in getUserCourses when fetching courses: ${error}`,
    });
  }
};

const createCourse = async (req, res) => {
  const { title, identifier, userID } = req.body;
  const authUser = req.user;
  if (authUser !== userID) {
    return res.status(403).json({
      status: "error",
      message: "You are not authorized to create this course",
    });
  }

  if (!title) {
    return res.status(400).json({
      message: "Course title is required",
    });
  }

  if (!identifier) {
    return res.status(400).json({
      message: "Course identifier is required",
    });
  }
  try {
    // check if course already exists
    const course = await getCourseByIdentifier(identifier);
    if (course.length > 0) {
      // Go to the usercourses table and check if the course is already in the user's courses
      const userCourse = await getUserCourseByCourseId(
        userID,
        course[0].idcourses
      );

      if (userCourse.length > 0) {
        return res.status(400).json({
          message: "Course already in user's courses",
        });
      } else {
        await addUserCourse(userID, course[0].idcourses);
        const updatedCourse = await getSingleUserCourseExpanded(
          userID,
          identifier
        );
        return res.status(200).json(updatedCourse);
      }
    }

    const newCourse = await createCourseByIdentifierAndAddUser(
      title,
      identifier,
      userID
    );
    return res.status(201).json(newCourse);
  } catch (error) {
    return res.status(500).json({
      message: `Error in createCourse when creating course: ${error}`,
    });
  }
};

module.exports = {
  getCourses,
  getUserCourses,
  createCourse,
};

