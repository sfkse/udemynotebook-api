const express = require("express");
const router = express.Router();

const { getCourseLectures } = require("../controllers/courseController");

router.get("/:userID", getCourseLectures);

module.exports = router;

