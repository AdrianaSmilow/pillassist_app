// server/app.js

const express = require("express");
const app = express();

// Middleware pro parsování JSON těla požadavků
app.use(express.json());

// Mount routerů
app.use("/medicine",  require("./controller/medicine"));
app.use("/usage",     require("./controller/usage"));
app.use("/dashboard", require("./controller/dashboard"));

// Spuštění serveru
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` PillAssist server běží na http://localhost:${PORT}`);
});