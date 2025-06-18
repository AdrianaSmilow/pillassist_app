// server/controller/medicine.js
const express = require("express");
const router  = express.Router();

// Načti ABL funkce
const createAbl      = require("../abl/medicine/createAbl");
const listAbl        = require("../abl/medicine/listAbl");
const getAbl         = require("../abl/medicine/getAbl");
const lowStockAbl    = require("../abl/medicine/lowStockAbl");
const ackLowStockAbl = require("../abl/medicine/ackLowStockAbl");
const updateStockAbl = require("../abl/medicine/updateStockAbl");
const deleteAbl      = require("../abl/medicine/deleteAbl");
const updateAbl      = require("../abl/medicine/updateAbl");

// Napoj routery
router.post  ("/create",       createAbl);
router.get   ("/list",         listAbl);
router.get   ("/get",          getAbl);
router.get   ("/low-stock",    lowStockAbl);
router.post  ("/ack-low-stock",ackLowStockAbl);
router.patch ("/stock",        updateStockAbl);
router.post  ("/delete",       deleteAbl);
router.post("/update", updateAbl);

module.exports = router;