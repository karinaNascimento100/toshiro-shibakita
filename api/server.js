import express from "express";
import mysql from "mysql2/promise";
import os from "os";

const app = express();
const PORT = process.env.PORT || 3000;

// middleware ANTES das rotas
app.use((req, res, next) => {
  res.setHeader("X-Instance", os.hostname());
  next();
});

app.get("/healthz", (_, res) => res.status(200).send("ok"));

app.get("/", async (_, res) => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || "db",
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });
    const [rows] = await conn.query("SELECT NOW() AS now");
    await conn.end();
    res.json({ message: "Hello DIO from API with MySQL!", now: rows[0].now });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log(`API listening on ${PORT}`));
