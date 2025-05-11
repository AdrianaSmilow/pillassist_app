// server/abl/dashboard/getAbl.js

const medicineDao = require("../../dao/medicine-dao");
const usageDao    = require("../../dao/usage-dao");

// Pomocná funkce pro kontrolu formátu YYYY-MM-DD
function isValidDate(str) {
  return /^\d{4}-\d{2}-\d{2}$/.test(str) && !isNaN(new Date(str));
}

function getAbl(req, res) {
  let date = req.query.date;

  // 1. Pokud datum není zadáno, použije dnešní
  if (!date) {
    date = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  }

  // 2. Ověření formátu a nepřekročení dneška, uživatel nenahlíží do budoucnosti
  if (!isValidDate(date)) {
    return res.status(400).json({
      code: "invalidDate",
      message: "Neplatný formát data, očekává se YYYY-MM-DD."
    });
  }
  if (new Date(date) > new Date()) {
    return res.status(400).json({
      code: "invalidDate",
      message: "Datum nesmí být v budoucnosti."
    });
  }

  try {
    // Načteme všechny záznamy užití a léky
    const usageAll     = usageDao.list();
    const medicineAll  = medicineDao.list();

    // Vytvoříme mapu označující, co bylo užito
    const usageForDay = usageAll
      .filter(u => u.usageDate === date)
      .map(u => ({ medicineId: u.medicineId, used: true }));
    const usedSet = new Set(usageForDay.map(u => u.medicineId));

    // Pro léky bez záznamu denního užití doplníme used: false
    const usage = [
      ...usageForDay,
      ...medicineAll
        .filter(m => !usedSet.has(m.id))
        .map(m => ({ medicineId: m.id, used: false }))
    ];

    // Sestavíme pole stock podle medicineAll
    const stock = medicineAll.map(m => ({
      medicineId:        m.id,
      currentStock:      m.count,
      lowStockThreshold: m.lowStockThreshold,
      ordered:           m.ordered
    }));

    return res.status(200).json({ date, usage, stock });
  } catch (e) {
    return res.status(500).json({
      code: "internal",
      message: "Chyba serveru při načítání dashboardu"
    });
  }
}

module.exports = getAbl;