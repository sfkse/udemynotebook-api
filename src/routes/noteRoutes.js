const express = require("express");
const router = express.Router();

const { getUserCourseNotes } = require("../controllers/noteController");

router.get("/course", getUserCourseNotes);

module.exports = router;

