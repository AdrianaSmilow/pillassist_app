// server/abl/usage/listAbl.js

const usageDao    = require("../../dao/usage-dao");
const medicineDao = require("../../dao/medicine-dao");

function listAbl(req, res) {
  const medicineId = req.query.medicineId;
  if (!medicineId) {
    return res.status(400).json({
      code: "dtoInIsNotValid",
      message: "Chybí parametr medicineId"
    });
  }

  // kontrola, že lék existuje
  const med = medicineDao.get(medicineId);
  if (!med) {
    return res.status(404).json({
      code: "medicineNotFound",
      message: "Lék s tímto názvem neexistuje"
    });
  }

  try {
    const usageList = usageDao.list({ medicineId });
    return res.status(200).json({ usageList });
  } catch (e) {
    return res.status(500).json({
      code: "internal",
      message: "Chyba serveru při načítání historie užití"
    });
  }
}

module.exports = listAbl;