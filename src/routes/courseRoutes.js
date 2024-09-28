const express = require("express");
const router = express.Router();

const {
  createCourse,
  getUserCourses,
} = require("../controllers/courseController");

router.get("/:idusers", getUserCourses);
router.post("/", createCourse);

module.exports = router;

