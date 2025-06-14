// server/abl/usage/createAbl.js

const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);  // <— registruje validátory pro "date", nakonec nepotřebné, nebudu validovat "date" na backendu

const usageDao   = require("../../dao/usage-dao");
const medicineDao = require("../../dao/medicine-dao");

// JSON-schéma pro vytvoření záznamu užití
const schema = {
  type: "object",
  properties: {
    medicineId: { type: "string" },
    usageDate:  { type: "string"},
    count:      { type: "integer", minimum: 1 },
    note:       { type: "string" }
  },
  required: ["medicineId","count"],
  additionalProperties: false
};

async function createAbl(req, res) {
  // validace vstupu
  const valid = ajv.validate(schema, req.body);
  if (!valid) {
    return res.status(400).json({
      code: "dtoInIsNotValid",
      message: "Neplatná vstupní data pro vytvoření záznamu užití",
      validationErrors: ajv.errors
    });
  }
  const { medicineId, usageDate, count, note } = req.body;

  // existuje lék?
  const med = medicineDao.get(medicineId);
  if (!med) {
    return res.status(404).json({
      code: "medicineNotFound",
      message: "Lék s tímto názvem neexistuje"
    });
  }

  try {
    // vytvoří záznam a zároveň odečte zásobu
    const usage = usageDao.create({ medicineId, usageDate, count, note });
    medicineDao.updateStock(medicineId, -count);
    return res.status(200).json({ usage });
  } catch (e) {
    if (e.code === "unsufficientStock") {
      return res.status(400).json({ code: e.code, message: e.message });
    }
    return res.status(500).json({
      code: "internal",
      message: "Chyba serveru při ukládání záznamu užití"
    });
  }
}

module.exports = createAbl;