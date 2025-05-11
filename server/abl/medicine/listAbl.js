// server/abl/medicine/listAbl.js

const medicineDao = require("../../dao/medicine-dao");

async function listAbl(_req, res) {
  try {
    // Načteme všechna medicine
    const stockList = medicineDao.list();

    // Pokud nic není, vrátíme prázdné pole
    return res.status(200).json({ stockList });
  } catch (e) {
    // neočekávaná chyba
    return res.status(500).json({
      code: "internal",
      message: "Chyba serveru při načítání seznamu léků"
    });
  }
}

module.exports = listAbl;

