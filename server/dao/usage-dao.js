// server/dao/usage-dao.js
const fs     = require("fs");
const path   = require("path");
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
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadUsage", message: "Nepodařilo se načíst záznam užití." };
  }
}

// Vytvoří nový záznam užití
function create({ medicineId, usageDate, count, note }) {
  try {
    const id = crypto.randomUUID();
    const dto = { id, medicineId, usageDate, count, note };
    fs.writeFileSync(
      path.join(usageFolderPath, `${id}.json`),
      JSON.stringify(dto, null, 2),
      "utf8"
    );
    return dto;
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
    if (error.code === "ENOENT") return {};
    throw { code: "failedToRemoveUsage", message: "Nepodařilo se smazat záznam užití." };
  }
}

// Vrátí seznam záznamů užití; filtruje podle medicineId, pokud je zadáno
function list(filter = {}) {
  try {
    const files = fs.readdirSync(usageFolderPath);
    let usageList = files.map(file =>
      JSON.parse(fs.readFileSync(path.join(usageFolderPath, file), "utf8")))
    ;
    if (filter.medicineId) {
      usageList = usageList.filter(item => item.medicineId === filter.medicineId);
    }
    // Seřadíme sestupně podle data užití
    usageList.sort((a, b) => new Date(b.usageDate) - new Date(a.usageDate));
    return usageList;
  } catch (error) {
    throw { code: "failedToListUsage", message: "Nepodařilo se načíst seznam záznamů užití." };
  }
}

module.exports = { get, create, remove, list };
