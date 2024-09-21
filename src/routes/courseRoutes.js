const express = require("express");
const router = express.Router();

const {
  getCourseLectures,
  createCourse,
} = require("../controllers/courseController");

router.get("/:userID", getCourseLectures);
router.post("/", createCourse);

module.exports = router;

