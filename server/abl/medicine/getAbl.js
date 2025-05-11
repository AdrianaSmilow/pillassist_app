// server/abl/medicine/getAbl.js

const medicineDao = require("../../dao/medicine-dao");

async function getAbl(req, res) {
  // 1. Validace přítomnosti id v query parametru
  const id = req.query.id;
  if (!id) {
    return res.status(400).json({
      code: "dtoInIsNotValid",
      message: "Chybí parametr id."
    });
  }

  try {
    // 2. Načtení léku
    const medicine = medicineDao.get(id);
    if (!medicine) {
      return res.status(404).json({
        code: "medicineNotFound",
        message: "Lék s tímto ID neexistuje."
      });
    }

    // 3. Sestavení URL pro historii užití
    const usageListUrl = `/usage/list?medicineId=${id}`;

    // 4. Odpověď
    return res.status(200).json({ medicine, usageListUrl });
  } catch (e) {
    // neočekávaná chyba při čtení
    return res.status(500).json({
      code: "internal",
      message: "Chyba serveru při načítání léku"
    });
  }
}

module.exports = getAbl;