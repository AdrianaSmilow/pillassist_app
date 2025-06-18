// server/app.js

const express = require("express");
const cors    = require("cors");

const app = express();

// 1) Manuálně dodefinujte CORS hlavičky pro všechny routy:
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin",  "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// 1) Povolit CORS pro všechny originy (vývoj)
app.use(cors());

// 2) Parsování JSON
app.use(express.json());

// 3) Mount routerů
app.use("/medicine",  require("./controller/medicine"));
app.use("/usage",     require("./controller/usage"));
app.use("/dashboard", require("./controller/dashboard"));

// 4) Spuštění serveru
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`PillAssist server běží na http://localhost:${PORT}`);
});

