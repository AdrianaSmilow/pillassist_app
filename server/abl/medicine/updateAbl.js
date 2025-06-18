// server/abl/medicine/updateAbl.js

const Ajv = require("ajv");
const ajv = new Ajv();
const medicineDao = require("../../dao/medicine-dao");

// Schéma přijímá ID a libovolnou kombinaci upravovaných polí
const schema = {
  type: "object",
  properties: {
    id:       { type: "string" },
    name:     { type: "string", minLength: 1 },
    count:    { type: "integer", minimum: 0 },
    category: { type: "string", enum: ["Lék", "Suplement"] }
  },
  required: ["id"],               // ID je povinné
  additionalProperties: false
};

async function updateAbl(req, res) {
  // Validace vstupního DTO
  const valid = ajv.validate(schema, req.body);
  if (!valid) {
    return res.status(400).json({
      code: "dtoInIsNotValid",
      message: "Neplatná vstupní data pro úpravu léku",
      validationErrors: ajv.errors
    });
  }

  const { id, name, count, category } = req.body;
  try {
    // medicineDao.update vrací aktualizovaný objekt
    const updated = medicineDao.update(id, { name, count, category });
    if (!updated) {
      return res.status(404).json({
        code: "medicineNotFound",
        message: "Lék s tímto ID neexistuje."
      });
    }
    // Vrátíme aktualizovaný objekt pod klíčem medicine
    return res.status(200).json({ medicine: updated });
  } catch (e) {
    return res.status(500).json({
      code: "internal",
      message: "Chyba serveru při ukládání změn léku"
    });
  }
}

module.exports = updateAbl;
