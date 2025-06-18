// src/api/fetch-helper.js

/**
 * Funkce pro volání HTTP endpointů.
 * @param {string} baseUri – základní URI backendu
 * @param {string} useCase  – cesta za baseUri (např. "medicine/list")
 * @param {object|null} dtoIn – query params / body
 * @param {string} method    – "get" | "post" | "patch" | "delete"
 */
async function Call(baseUri, useCase, dtoIn, method) {
  const url = `/${useCase}`;
  let response;

  if (!method || method.toLowerCase() === "get") {
    const query = dtoIn && Object.keys(dtoIn).length
      ? `?${new URLSearchParams(dtoIn)}`
      : "";
    response = await fetch(url + query);
  } else {
    response = await fetch(url, {
      method: method.toUpperCase(),
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dtoIn),
    });
  }

  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}

// Default exportujeme funkci Call
export default Call;

// A zároveň pojmenovaně exportujeme agregátor, pokud ho někde chcete využít
const baseUri = "http://localhost:3000";
export const FetchHelper = {
  medicine: {
    list:       (params) => Call(baseUri, "medicine/list",      params, "get"),
    get:        (dto)    => Call(baseUri, "medicine/get",       dto,    "get"),
    create:     (dto)    => Call(baseUri, "medicine/create",    dto,    "post"),
    lowStock:   ()       => Call(baseUri, "medicine/low-stock", null,   "get"),
    ackLowStock:(dto)    => Call(baseUri, "medicine/ack-low-stock", dto, "post"),
    updateStock:(dto)    => Call(baseUri, "medicine/stock",      dto,    "patch"),
    update:     (dto)    => Call(baseUri, "medicine/update",     dto,    "post"),
    delete:     (dto)    => Call(baseUri, "medicine/delete",     dto,    "post"),
  },
  usage: {
    list:   (params) => Call(baseUri, "usage/list",   params, "get"),
    create: (dto)    => Call(baseUri, "usage/create", dto,    "post"),
    delete: (dto)    => Call(baseUri, "usage/delete", dto,    "delete"),
  },
};
