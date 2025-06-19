// src/api/medicine-api.js

import call from "./fetch-helper";

const medicineApi = {
  /** GET /medicine/list */
  list: () => call("/medicine/list"),
  /** GET /medicine/low-stock */
  lowStock: () => call("/medicine/low-stock"),
  get: ({ id }) => call(`/medicine/get?id=${id}`),
  /** POST /medicine/create */
  create: dto =>
    call("/medicine/create", {
      method: "POST",
      body: JSON.stringify(dto),
    }),
  /** POST /medicine/ack-low-stock */
  ackLowStock: dto =>
    call("/medicine/ack-low-stock", {
      method: "POST",
      body: JSON.stringify(dto),
    }),
  /** PATCH /medicine/stock */
  updateStock: dto =>
    call("/medicine/stock", {
      method: "PATCH",
      body: JSON.stringify(dto),
    }),
  /** POST /medicine/update */
  update: dto =>
    call("/medicine/update", {
      method: "POST",
      body: JSON.stringify(dto),
    }),
  /** POST /medicine/delete */
  delete: dto =>
    call("/medicine/delete", {
      method: "POST",
      body: JSON.stringify(dto),
    }),
};

export default medicineApi;


