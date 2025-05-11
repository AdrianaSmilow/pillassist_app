// server/controller/dashboard.js
const express = require("express");
const router  = express.Router();
const getAbl   = require("../abl/dashboard/getAbl");

router.get("/", getAbl);

module.exports = router;