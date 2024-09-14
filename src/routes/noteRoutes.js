const express = require("express");
const router = express.Router();

const {
  getUserCourseNotes,
  createLectureNote,
  getNotesByLectureName,
} = require("../controllers/noteController");

router.post("/create", createLectureNote);
router.get("/course", getUserCourseNotes);
router.get("/lecture", getNotesByLectureName);

module.exports = router;

