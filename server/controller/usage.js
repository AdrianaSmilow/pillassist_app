// server/controller/usage.js
const express = require("express");
const router  = express.Router();
const createAbl = require("../abl/usage/createAbl");
const listAbl   = require("../abl/usage/listAbl");
const deleteAbl = require("../abl/usage/deleteAbl");

router.post   ("/create", createAbl);
router.get    ("/list",   listAbl);
router.delete ("/delete", deleteAbl);

module.exports = router;