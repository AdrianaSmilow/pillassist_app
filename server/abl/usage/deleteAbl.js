// server/abl/usage/deleteAbl.js

const usageDao    = require("../../dao/usage-dao");
const medicineDao = require("../../dao/medicine-dao");

function deleteAbl(req, res) {
  const usageId = req.body.usageId;
  if (!usageId) {
    return res.status(400).json({
      code: "dtoInIsNotValid",
      message: "Chybí parametr usageId"
    });
  }

  // existuje záznam užití?
  const usage = usageDao.get(usageId);
  if (!usage) {
    return res.status(404).json({
      code: "usageNotFound",
      message: "pro tento lék/suplement nejsou žádné záznamy"
    });
  }

  try {
    // smažeme a vrátíme zásobu zpět
    usageDao.remove(usageId);
    medicineDao.updateStock(usage.medicineId, usage.count);
    return res.sendStatus(204);
  } catch (e) {
    return res.status(500).json({
      code: "internal",
      message: "Chyba serveru při mazání záznamu užití"
    });
  }
}

module.exports = deleteAbl;
