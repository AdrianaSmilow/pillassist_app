// server/abl/medicine/updateStockAbl.js

const Ajv = require("ajv");
const ajv = new Ajv();
const medicineDao = require("../../dao/medicine-dao");

// schema pro PATCH /medicine/stock
const schema = {
  type: "object",
  properties: {
    id:    { type: "string" },
    delta: { type: "integer" }
  },
  required: ["id","delta"],
  additionalProperties: false
};

function updateStockAbl(req, res) {
  const valid = ajv.validate(schema, req.body);
  if (!valid) {
    return res.status(400).json({
      code: "dtoInIsNotValid",
      message: "Neplatná vstupní data pro úpravu zásoby"
    });
  }

  const { id, delta } = req.body;
  try {
    const updated = medicineDao.updateStock(id, delta);
    if (!updated) {
      return res.status(404).json({
        code: "medicineNotFound",
        message: "Lék s tímto názvem neexistuje."
      });
    }
    return res.status(200).json({ medicineId: id, currentStock: updated.count });
  } catch (e) {
    if (e.code === "unsufficientStock") {
      return res.status(400).json({ code: e.code, message: e.message });
    }
    return res.status(500).json({
      code: "internal",
      message: "Chyba serveru při úpravě zásoby"
    });
  }
}

module.exports = updateStockAbl;