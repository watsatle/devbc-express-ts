import express from "express";
import ServerlessHttp from "serverless-http";

export const app = express();
export const handler = ServerlessHttp(app);

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    details: "All systems are functioning properly",
    timestamp: new Date().toISOString(),
  });
});