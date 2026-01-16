import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const KGD_BASE_URL = "https://portal.kgd.gov.kz";
const KGD_TOKEN = process.env.KGD_TOKEN;

// Проверка, что сервер жив
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Основной endpoint
app.post("/api/check", async (req, res) => {
  try {
    const params = req.body;

    const response = await axios.get(
      `${KGD_BASE_URL}/services/isnaportalsync/public/taxpayer-data`,
      {
        params,
        headers: {
          "X-Portal-Token": KGD_TOKEN
        },
        timeout: 15000
      }
    );

    res.json(response.data);
} catch (error) {
  const status = error?.response?.status || 500;
  const data = error?.response?.data || error.message;

  console.error("KGD ERROR:", status, data);

  res.status(status).json({
    error: "KGD request failed",
    status,
    kgd: data
  });
}

