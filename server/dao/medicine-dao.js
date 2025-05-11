// server/dao/medicine-dao.js

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Cesta ke složce pro JSON soubory s léky
const medicineFolderPath = path.join(__dirname, "storage", "medicineList");

// Načte lék podle jeho ID
function getMedicine(id) {
  try {
    const filePath = path.join(medicineFolderPath, `${id}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
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
    medicine.id = crypto.randomBytes(16).toString("hex");
    medicine.ordered = false;
    const filePath = path.join(medicineFolderPath, `${medicine.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(medicine, null, 2), "utf8");
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
  const filePath = path.join(medicineFolderPath, `${id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(medicine, null, 2), "utf8");
  return medicine;
}

// Označí lék jako objednaný (ordered = true)
function ackLowStock(id) {
  const medicine = getMedicine(id);
  if (!medicine) return null;
  medicine.ordered = true;
  const filePath = path.join(medicineFolderPath, `${id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(medicine, null, 2), "utf8");
  return medicine;
}

// Vrátí všechny léky
function listMedicine() {
  try {
    const files = fs.readdirSync(medicineFolderPath);
    return files.map(file => {
      const data = fs.readFileSync(path.join(medicineFolderPath, file), "utf8");
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
    const filePath = path.join(medicineFolderPath, `${id}.json`);
    fs.unlinkSync(filePath);
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