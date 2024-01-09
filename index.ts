import express from "express";

const app = express();

const port = process.env.PORT || 8080;

import { createConnection } from "mysql";

const connection = createConnection({
  host: process.env.DB_POOL_HOST,
  port: process.env.DB_POOL_PORT
    ? parseInt(process.env.DB_POOL_PORT, 10)
    : undefined,
  user: process.env.DB_POOL_USER,
  password: process.env.DB_POOL_PWD,
  database: process.env.DB_POOL_DB,
});

app.get("/customer", (_req, res, next) => {
  connection.connect();

  connection.query("SELECT * FROM customers;", (err, rows) => {
    if (err) {
      next(err);
    }

    res.send({ result: rows });
  });

  connection.end();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
