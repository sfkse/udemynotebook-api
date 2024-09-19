const express = require("express");
const router = express.Router();

const { exportToGdocs } = require("../controllers/googleDocsController");

router.post("/", exportToGdocs);

module.exports = router;

