// src/api/fetch-helper.js

/**
 * Funkce pro volání HTTP endpointů.
 * @param {string} baseUri - základní URI backendu
 * @param {string} useCase - cesta za baseUri (např. "medicine/list")
 * @param {object|null} dtoIn - vstupní data (query params pro GET, body pro ostatní metody)
 * @param {string} method - HTTP metoda: "get", "post", "patch", "delete"
 */
async function Call(baseUri, useCase, dtoIn, method) {
  let response;
  const url = `${baseUri}/${useCase}`;

  if (!method || method.toLowerCase() === "get") {
    // GET: data do query stringu
    const query = dtoIn && Object.keys(dtoIn).length
      ? `?${new URLSearchParams(dtoIn)}`
      : "";
    response = await fetch(url + query);
  } else {
    // POST, PATCH, DELETE: data v JSON těle
    response = await fetch(url, {
      method: method.toUpperCase(),
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dtoIn),
    });
  }

  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}

// Základní adresa backendu
const baseUri = "http://localhost:3000";

/**
 * FetchHelper seskupuje metody pro všechny entity v aplikaci
 */
const FetchHelper = {
  // Metody pro práci s léky
  medicine: {
    list: async (params) => await Call(baseUri, "medicine/list", params, "get"),
    get: async (dtoIn) => await Call(baseUri, "medicine/get", dtoIn, "get"),
    create: async (dtoIn) => await Call(baseUri, "medicine/create", dtoIn, "post"),
    lowStock: async () => await Call(baseUri, "medicine/low-stock", null, "get"),
    ackLowStock: async (dtoIn) => await Call(baseUri, "medicine/ack-low-stock", dtoIn, "post"),
    updateStock: async (dtoIn) => await Call(baseUri, "medicine/stock", dtoIn, "patch"),
    update: async (dtoIn) => await Call(baseUri, "medicine/update", dtoIn, "post"),
    delete: async (dtoIn) => {return await Call(baseUri, "medicine/delete", dtoIn, "post");
    },
  },

  // Metody pro práci se záznamy užití
  usage: {
    list: async (params) => await Call(baseUri, "usage/list", params, "get"),
    create: async (dtoIn) => await Call(baseUri, "usage/create", dtoIn, "post"),
    delete: async (dtoIn) => await Call(baseUri, "usage/delete", dtoIn, "delete"),
  },
};

export default FetchHelper;
