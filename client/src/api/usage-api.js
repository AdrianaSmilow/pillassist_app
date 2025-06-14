// src/api/usage-api.js

// Obecná funkce pro volání API (GET, POST, DELETE)
import Call from "./fetch-helper";

// Základní URI backendu
const BASE_URI = "http://localhost:3000";

/**
 * usageApi – wrapper nad všemi /usage endpointy
 */
const usageApi = {
  /**
   * Načte historii užití pro konkrétní medicínu
   * GET /usage/list?medicineId=…
   * @param {{ medicineId: string }} params
   * @returns {Promise<{ok: boolean, status: number, data: { usageList: Array } }>}
   */
  list: async (params) => {
    return await Call(BASE_URI, "usage/list", params, "get");
  },

  /**
   * Vytvoří nový záznam užití
   * POST /usage/create
   * Backend očekává:
   *   - medicineId  (string)  – ID léku/suplementu
   *   - count       (integer) – počet kusů, minimálně 1
   *   - usageDate   (string)  – datum ve formátu "YYYY-MM-DD" (volitelné)
   *   - note        (string)  – poznámka (volitelné)
   *
   * @param {{
   *   medicineId: string,
   *   count: number,
   *   usageDate?: string,
   *   note?: string
   * }} dtoIn
   * @returns {Promise<{ok: boolean, status: number, data: { usage: Object } }>}
   */
  create: async (dtoIn) => {
    return await Call(BASE_URI, "usage/create", dtoIn, "post");
  },

  /**
   * Smaže existující záznam užití
   * DELETE /usage/delete
   * Backend očekává v těle:
   *   - usageId (string) – ID záznamu k odstranění
   *
   * @param {{ usageId: string }} dtoIn
   * @returns {Promise<{ok: boolean, status: number, data: any }>}
   */
  delete: async (dtoIn) => {
    return await Call(BASE_URI, "usage/delete", dtoIn, "delete");
  },
};

export default usageApi;
