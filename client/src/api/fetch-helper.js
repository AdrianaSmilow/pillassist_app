// src/api/fetch-helper.js

/**
 * Jednotný fetch helper pro všechny API volání.
 * @param {string} path        Relativní cesta, např. "/medicine/create" nebo "/usage/list"
 * @param {object} [options]   Fetch-options (method, headers, body…)
 * @returns {Promise<{ ok: boolean, status: number, data: any }>}
 */
async function call(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}

export default call