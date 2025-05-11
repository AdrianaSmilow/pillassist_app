// server/abl/medicine/createAbl.js

const Ajv = require("ajv");
const ajv = new Ajv();

const medicineDao = require("../../dao/medicine-dao");

// JSON-schéma vstupních dat pro vytvoření léku
// category - ve frontendu bude vyběr z Lék nebo Suplement (radio button)
const schema = {
  type: "object",
  properties: {
    name:              { type: "string", minLength: 1 },
    count:             { type: "integer", minimum: 0 },
    lowStockThreshold: { type: "integer", minimum: 0 },
    category:          { type: "string", enum: ["Lék", "Suplement"] },
    activeSubstance:   { type: "string" },
    strength:          { type: "string" },
    dosage:            { type: "string" },
    note:              { type: "string" }
  },
  required: ["name","count","lowStockThreshold","category"],
  additionalProperties: false
};

async function createAbl(req, res) {
  // 1. Validace vstupu
  const valid = ajv.validate(schema, req.body);
  if (!valid) {
    return res.status(400).json({
      code: "dtoInIsNotValid",
      message: "Neplatná vstupní data pro vytvoření léku",
      validationErrors: ajv.errors
    });
  }

  // 2. Vytvoření záznamu
  try {
    const medicine = medicineDao.create(req.body);
    return res.status(200).json({ medicine });
  } catch (e) {
    if (e.code === "duplicateName") {
      return res.status(400).json({
        code: e.code,
        message: "lék/suplement s tímto názvem již existuje"
      });
    }
    // neočekávaná chyba
    return res.status(500).json({
      code: "internal",
      message: "Chyba serveru při vytváření léku"
    });
  }
}

module.exports = createAbl;