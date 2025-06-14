// src/api/medicine-api.js

// Obecná funkce Call pro HTTP požadavky (GET, POST, PATCH)
import Call from "./fetch-helper";

// Základní adresa backendu
const BASE_URI = "http://localhost:3000";

/**
 * medicineApi – wrapper nad všemi /medicine endpointy
 */
const medicineApi = {
  /**
   * Načte celý seznam léků/suplementů
   * GET /medicine/list
   * @param {Object} [params] – nepovinné query parametry
   * @returns {Promise<{ok: boolean, status: number, data: {stockList: Array}}>}
   */
  list: async (params) => {
    return await Call(BASE_URI, "medicine/list", params, "get");
  },

  /**
   * Načte položky s nízkou zásobou
   * GET /medicine/low-stock
   * @returns {Promise<{ok: boolean, status: number, data: {stockList: Array}}>}
   */
  lowStock: async () => {
    return await Call(BASE_URI, "medicine/low-stock", null, "get");
  },

  /**
   * Vytvoří novou položku léku/suplementu
   * POST /medicine/create
   * Backend vyžaduje:
   *   - name               (string)  – název
   *   - count              (integer) – počáteční množství
   *   - lowStockThreshold  (integer) – od kdy je zásoba nízká
   *   - category           (string)  – "Lék" nebo "Suplement"
   * Volitelně:
   *   - activeSubstance    (string)
   *   - strength           (string)
   *   - dosage             (string)
   *   - note               (string)
   *
   * @param {{
   *   name: string,
   *   count: number,
   *   lowStockThreshold: number,
   *   category: string,
   *   activeSubstance?: string,
   *   strength?: string,
   *   dosage?: string,
   *   note?: string
   * }} dtoIn
   * @returns {Promise<{ok: boolean, status: number, data: {medicine: Object} | {code:string,message:string,validationErrors:Array}}>}
   */
  create: async (dtoIn) => {
    return await Call(BASE_URI, "medicine/create", dtoIn, "post");
  },

  /**
   * Potvrdí upozornění na nízkou zásobu
   * POST /medicine/ack-low-stock
   * @param {{ id: string }} dtoIn – ID položky
   * @returns {Promise<{ok: boolean, status: number, data: any}>}
   */
  ackLowStock: async (dtoIn) => {
    return await Call(BASE_URI, "medicine/ack-low-stock", dtoIn, "post");
  },

  /**
   * Aktualizuje množství na skladě
   * PATCH /medicine/stock
   * @param {{ id: string, stock: number }} dtoIn
   * @returns {Promise<{ok: boolean, status: number, data: any}>}
   */
  updateStock: async (dtoIn) => {
    return await Call(BASE_URI, "medicine/stock", dtoIn, "patch");
  },
};

export default medicineApi;
