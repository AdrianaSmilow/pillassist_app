// src/api/usage-api.js

// Import defaultní Call funkce
import Call from "./fetch-helper";

const BASE_URI = "http://localhost:3000";

const usageApi = {
  /**
   * GET /usage/list
   * @param {object} [params] – nepovinné query parametry (např. { medicineId: "..." })
   */
  list: async (params) => Call(BASE_URI, "usage/list", params, "get"),

  /**
   * POST /usage/create
   * @param {object} dtoIn – data pro nový záznam užití
   */
  create: async (dtoIn) => Call(BASE_URI, "usage/create", dtoIn, "post"),

  /**
   * DELETE /usage/delete
   * @param {{ usageId: string }} dtoIn – objekt s ID záznamu k smazání
   */
  delete: async (dtoIn) => Call(BASE_URI, "usage/delete", dtoIn, "delete"),
};

export default usageApi;

