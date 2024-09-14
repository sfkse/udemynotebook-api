const express = require("express");
const router = express.Router();

const {
  getUserCourseNotes,
  createLectureNote,
  getNotesByLectureName,
  removeNote,
  updateNote, // Add this import
} = require("../controllers/noteController");

router.post("/create", createLectureNote);
router.get("/course", getUserCourseNotes);
router.get("/lecture", getNotesByLectureName);
router.post("/delete", removeNote);
router.put("/update", updateNote); // Add this route

module.exports = router;

