import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes";
import helmet from "helmet";
import cors from "cors";

const app = express();

app.use(helmet());
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Egora Clone API v1.0" });
});

export default app;
