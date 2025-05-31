// pillassist_app/client/src/api/medicine-api.js

import { fetchJson } from "./fetch-helper";

/**
 * GET /medicine/list
 * Backend vrací objekt ve tvaru { stockList: [ {...}, {...}, … ] }.
 * Proto zde rozbalíme `resp.data.stockList`.
 */
export async function listMedicines() {
  const resp = await fetchJson("/medicine/list");
  return resp.data.stockList;
}

/**
 * POST /medicine/create
 * dtoIn musí obsahovat:
 *   {
 *     category: String,
 *     name: String,
 *     count: Number,
 *     lowStockThreshold: Number,
 *     activeSubstance?: String,
 *     doseStrength?: String,
 *     dosageRecommend?: String,
 *     note?: String
 *   }
 * Vrací nově vytvořený objekt léku (pokud backend odpovídá `{ data: { … } }`).
 */
export async function createMedicine(dtoIn) {
  const resp = await fetchJson("/medicine/create", {
    method: "POST",
    body: JSON.stringify(dtoIn),
  });
  return resp.data;
}

/**
 * GET /medicine/get?id=<UUID>
 * Vrací objekt { data: { id, category, name, count, lowStockThreshold, activeSubstance, doseStrength, dosageRecommend, note } }
 */
export async function getMedicineById(id) {
  const resp = await fetchJson(`/medicine/get?id=${encodeURIComponent(id)}`);
  return resp.data;
}

/**
 * PUT /medicine/updateStock
 * dtoIn = { medicineId: String, usedCount: Number }
 * Vrací { data: { newCount: <Number>, … } } nebo podobně.
 */
export async function updateStock({ medicineId, usedCount }) {
  const resp = await fetchJson("/medicine/updateStock", {
    method: "PUT",
    body: JSON.stringify({ medicineId, usedCount }),
  });
  return resp.data;
}

/**
 * DELETE /medicine/delete?id=<UUID>
 * Vrací { data: { success: true } } nebo podobně.
 */
export async function deleteMedicine(id) {
  const resp = await fetchJson(`/medicine/delete?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  return resp.data;
}

/**
 * GET /medicine/lowStock
 * Vrací { data: { stockList: [ { … } ] } } – seznam položek s nízkou zásobou.
 * Zde vracíme rovnou `resp.data.stockList`.
 */
export async function getLowStockItems() {
  const resp = await fetchJson("/medicine/lowStock");
  return resp.data.stockList;
}

/**
 * PUT /medicine/ackLowStock
 * dtoIn = { medicineId: String }
 * Vrací { data: { success: true } } nebo podobně.
 */
export async function acknowledgeLowStock(medicineId) {
  const resp = await fetchJson("/medicine/ackLowStock", {
    method: "PUT",
    body: JSON.stringify({ medicineId }),
  });
  return resp.data;
}
