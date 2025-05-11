// server/abl/medicine/lowStockAbl.js

const medicineDao = require("../../dao/medicine-dao");

// Funkce pro získání položek s nízkou zásobou
function lowStockAbl(_req, res) {
  try {
    const stockList = medicineDao.listLowStock();
    return res.status(200).json({ stockList });
  } catch (e) {
    return res.status(500).json({
      code: "internal",
      message: "Chyba serveru při načítání nízké zásoby léků"
    });
  }
}


module.exports = lowStockAbl;