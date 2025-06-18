// src/api/medicine-api.js

// Obecná funkce pro volání API
import Call from "./fetch-helper";

const BASE_URI = "http://localhost:3000";

const medicineApi = {
  /**
   * GET /medicine/list
   * @param {object} [params] – nepovinné query parametry
   */
  list: async (params) => Call(BASE_URI, "medicine/list", params, "get"),

  /**
   * GET /medicine/low-stock
   */
  lowStock: async () => Call(BASE_URI, "medicine/low-stock", null, "get"),

  /**
   * POST /medicine/create
   * @param {object} dtoIn – data pro nový záznam
   */
  create: async (dtoIn) => Call(BASE_URI, "medicine/create", dtoIn, "post"),

  /**
   * POST /medicine/ack-low-stock
   * @param {{ id: string }} dtoIn
   */
  ackLowStock: async (dtoIn) => Call(BASE_URI, "medicine/ack-low-stock", dtoIn, "post"),

  /**
   * PATCH /medicine/stock
   * @param {{ id: string, stock: number }} dtoIn
   */
  updateStock: async (dtoIn) => Call(BASE_URI, "medicine/stock", dtoIn, "patch"),

  /**
   * POST /medicine/update
   * @param {object} dtoIn
   */
  update: async (dtoIn) => Call(BASE_URI, "medicine/update", dtoIn, "post"),

  /**
   * POST /medicine/delete
   * @param {{ id: string }} dtoIn
   */
  delete: async (dtoIn) => Call(BASE_URI, "medicine/delete", dtoIn, "post"),
};

export default medicineApi;

