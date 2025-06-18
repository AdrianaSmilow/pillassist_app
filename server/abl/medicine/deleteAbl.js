// server/abl/medicine/deleteAbl.js

const medicineDao = require("../../dao/medicine-dao");

function deleteAbl(req, res) {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({
      code: "dtoInIsNotValid",
      message: "Chybí parametr id."
    });
  }

  try {
    // Smaže lék
    medicineDao.remove(id);
    return res.sendStatus(204); // No Content
  } catch (e) {
    return res.status(500).json({
      code: e.code || "internal",
      message: e.message || "Chyba serveru při mazání léku."
    });
  }
}

module.exports = deleteAbl;
