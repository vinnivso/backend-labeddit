import express, { Request, Response} from "express";
import cors from "cors";
import dotenv from "dotenv";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.listen(Number(process.env.PORT) || 3003, () => {
  console.log(`Server running on port ${Number(process.env.PORT) || 3003}`);
});

app.get("/ping", async (req: Request, res: Response) => {
  try {
    res.status(200).send({ message: "Pong!" });
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});
