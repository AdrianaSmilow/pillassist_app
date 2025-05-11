// server/abl/medicine/ackLowStockAbl.js

const medicineDao = require("../../dao/medicine-dao");

function ackLowStockAbl(req, res) {
  const { medicineId } = req.body;
  if (!medicineId) {
    return res.status(400).json({
      code: "dtoInIsNotValid",
      message: "Chybí parametr medicineId."
    });
  }

  try {
    const updated = medicineDao.ackLowStock(medicineId);
    if (!updated) {
      return res.status(404).json({
        code: "medicineNotFound",
        message: "Lék s tímto názvem neexistuje."
      });
    }
    return res.status(200).json({ medicineId, ordered: true });
  } catch (e) {
    return res.status(500).json({
      code: "internal",
      message: "Chyba serveru při potvrzování objednávky"
    });
  }
}

module.exports = ackLowStockAbl;