// server/dao/usage-dao.js

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Složka pro ukládání záznamů užití
const usageFolderPath = path.join(__dirname, "storage", "usageList");

// Načte záznam užití podle jeho ID
function get(usageId) {
  try {
    const filePath = path.join(usageFolderPath, `${usageId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") {
      return null;
    }
    throw { code: "failedToReadUsage", message: "Nepodařilo se načíst záznam užití." };
  }
}

// Vytvoří nový záznam užití - generuje UUID a uloží do souboru
function create(usage) {
  try {
    usage.id = crypto.randomBytes(16).toString("hex");
    const filePath = path.join(usageFolderPath, `${usage.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(usage, null, 2), "utf8");
    return usage;
  } catch (error) {
    throw { code: "failedToCreateUsage", message: "Nepodařilo se vytvořit záznam užití." };
  }
}

// Smaže záznam užití podle ID
function remove(usageId) {
  try {
    const filePath = path.join(usageFolderPath, `${usageId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw { code: "failedToRemoveUsage", message: "Nepodařilo se smazat záznam užití." };
  }
}

// Vrátí seznam záznamů užití; filtruje podle medicineId, pokud je zadáno
// Poznámka pro začátečníka k frontendu:
// Front-end zavolá GET /usage/list?medicineId=<id>
// Parametr medicineId zajistí, že se vrátí pouze záznamy pro konkrétní lék
function list(filter = {}) {
  try {
    const files = fs.readdirSync(usageFolderPath);
    let usageList = files.map(file => {
      const data = fs.readFileSync(path.join(usageFolderPath, file), "utf8");
      return JSON.parse(data);
    });
    if (filter.medicineId) {
      usageList = usageList.filter(item => item.medicineId === filter.medicineId);
    }
    usageList.sort((a, b) => new Date(b.usageDate) - new Date(a.usageDate));
    return usageList;
  } catch (error) {
    throw { code: "failedToListUsage", message: "Nepodařilo se načíst seznam záznamů užití." };
  }
}

module.exports = {
  get,
  create,
  remove,
  list
};


// server/dao/medicine-dao.js
const fs2 = require("fs");
const path2 = require("path");
const crypto2 = require("crypto");

// Cesta ke složce pro JSON soubory s léky
const medicineFolderPath = path2.join(__dirname, "storage", "medicineList");

// Načte lék podle jeho ID
function getMedicine(id) {
  try {
    const filePath = path2.join(medicineFolderPath, `${id}.json`);
    const fileData = fs2.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") {
      return null;
    }
    throw { code: "failedToReadMedicine", message: "Nepodařilo se načíst lék." };
  }
}

// Vytvoří nový lék a zajistí unikátní název
function createMedicine(medicine) {
  try {
    const all = listMedicine();
    if (all.some(item => item.name === medicine.name)) {
      throw { code: "duplicateName", message: "Lék se stejným názvem již existuje." };
    }
    medicine.id = crypto2.randomBytes(16).toString("hex");
    medicine.ordered = false;
    const filePath = path2.join(medicineFolderPath, `${medicine.id}.json`);
    fs2.writeFileSync(filePath, JSON.stringify(medicine, null, 2), "utf8");
    return medicine;
  } catch (error) {
    if (error.code === "duplicateName") throw error;
    throw { code: "failedToCreateMedicine", message: "Nepodařilo se vytvořit nový lék." };
  }
}

// Upraví zásobu léku podle delty; vyhodí chybu, pokud by zásoba klesla pod 0
function updateStock(id, delta) {
  const medicine = getMedicine(id);
  if (!medicine) return null;
  const newStock = medicine.count + delta;
  if (newStock < 0) {
    throw { code: "unsufficientStock", message: "Skladem není tolik kusů, nelze odečíst." };
  }
  medicine.count = newStock;
  const filePath = path2.join(medicineFolderPath, `${id}.json`);
  fs2.writeFileSync(filePath, JSON.stringify(medicine, null, 2), "utf8");
  return medicine;
}

// Označí lék jako objednaný (ordered = true)
function ackLowStock(id) {
  const medicine = getMedicine(id);
  if (!medicine) return null;
  medicine.ordered = true;
  const filePath = path2.join(medicineFolderPath, `${id}.json`);
  fs2.writeFileSync(filePath, JSON.stringify(medicine, null, 2), "utf8");
  return medicine;
}

// Vrátí všechny léky
function listMedicine() {
  try {
    const files = fs2.readdirSync(medicineFolderPath);
    return files.map(file => {
      const data = fs2.readFileSync(path2.join(medicineFolderPath, file), "utf8");
      return JSON.parse(data);
    });
  } catch (error) {
    throw { code: "failedToListMedicine", message: "Nepodařilo se načíst seznam léků." };
  }
}

// Vrátí léky s nízkou zásobou, které ještě nebyly označeny jako objednané
// Poznámka pro začátečníka k frontendu:
// Front-end zavolá GET /medicine/low-stock
// Tento endpoint vrátí pole léků, které mají zásobu ≤ lowStockThreshold a ordered=false
function listLowStock() {
  return listMedicine().filter(
    m => m.count <= m.lowStockThreshold && !m.ordered
  );
}

// Smaže lék podle ID
function removeMedicine(id) {
  try {
    const filePath = path2.join(medicineFolderPath, `${id}.json`);
    fs2.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw { code: "failedToRemoveMedicine", message: "Nepodařilo se smazat lék." };
  }
}

module.exports = {
  get: getMedicine,
  create: createMedicine,
  remove: removeMedicine,
  list: listMedicine,
  updateStock,
  ackLowStock,
  listLowStock
};