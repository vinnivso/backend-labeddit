import express from "express";
import cors from "cors";
import dotenv from "dotenv";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.listen(Number(process.env.PORT) || 8080, () => {
  console.log(`Server running on port ${Number(process.env.PORT) || 8080}`);
});
