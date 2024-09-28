const pool = require("../configs/db.config");
const { v4: uuidv4 } = require("uuid");
const { getTimestampSeconds } = require("../helpers/dateHelper");

const getCourseByIdentifier = async (identifier) => {
  const result = await pool.query(
    "SELECT * FROM courses WHERE identifier = ?",
    [identifier]
  );
  return result[0];
};

const getUserCoursesExpanded = async (userID) => {
  // Join usercourses with courses and notes
  const result = await pool.query(
    "SELECT * FROM usercourses uc JOIN courses c ON uc.idcourses = c.idcourses WHERE uc.idusers = ?",
    [userID]
  );

  return result[0];
};

const getSingleUserCourseExpanded = async (userID, identifier) => {
  const result = await pool.query(
    "SELECT * FROM usercourses uc JOIN courses c ON uc.idcourses = c.idcourses WHERE uc.idusers = ? and c.identifier = ?",
    [userID, identifier]
  );
  return result[0];
};

const createCourseByIdentifierAndAddUser = async (
  title,
  identifier,
  idusers
) => {
  const idcourses = uuidv4();
  const createdAt = getTimestampSeconds();
  const updatedAt = getTimestampSeconds();

  const result = await pool.query(
    "INSERT INTO courses (idcourses, createdAt, updatedAt, title, identifier) VALUES (?, ?, ?, ?, ?)",
    [idcourses, createdAt, updatedAt, title, identifier]
  );

  if (result[0].affectedRows === 1) {
    await addUserCourse(idusers, idcourses);
    const createdCourse = await getSingleUserCourseExpanded(
      idusers,
      identifier
    );
    return createdCourse[0];
  }
  return result[0];
};

const getUserCourseByCourseId = async (idusers, idcourses) => {
  const result = await pool.query(
    "SELECT * FROM usercourses WHERE idusers = ? and idcourses = ?",
    [idusers, idcourses]
  );
  return result[0];
};

const addUserCourse = async (idusers, idcourses) => {
  const createdAt = getTimestampSeconds();
  const updatedAt = getTimestampSeconds();
  const idusercourses = uuidv4();

  const result = await pool.query(
    "INSERT INTO usercourses (idusercourses, createdAt, updatedAt, idusers, idcourses) VALUES (?, ?, ?, ?, ?)",
    [idusercourses, createdAt, updatedAt, idusers, idcourses]
  );
  return result[0];
};

module.exports = {
  getCourseByIdentifier,
  createCourseByIdentifierAndAddUser,
  getUserCoursesExpanded,
  getSingleUserCourseExpanded,
  getUserCourseByCourseId,
  addUserCourse,
};

