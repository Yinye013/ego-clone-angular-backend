import express, { Request, Response } from "express";
import authRoutes from "./routes/authRoutes";
import helmet from "helmet";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.use(cors());

app.use("/api/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Egora Clone API v1.0" });
});

export default app;
