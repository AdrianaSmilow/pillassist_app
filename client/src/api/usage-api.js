// src/api/usage-api.js

import call from "./fetch-helper";

const usageApi = {
  /** GET /usage/list?medicineId=... */
  list: params =>
    call(
      `/usage/list${params?.medicineId ? `?medicineId=${params.medicineId}` : ""}`
    ),
  /** POST /usage/create */
  create: dto =>
    call("/usage/create", {
      method: "POST",
      body: JSON.stringify(dto),
    }),
  /** DELETE /usage/delete */
  delete: dto =>
    call("/usage/delete", {
      method: "DELETE",
      body: JSON.stringify(dto),
    }),
};

export default usageApi;



