import cors from "cors";
import type { Request, Response } from "express";
import express from "express";
import { commentsRouter } from "./routes/commentsRouter/commentsRoutes.js";
import { usersRouter } from "./routes/usersRouter/usersRoutes.js";

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/comments", commentsRouter);
app.use("/users", usersRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Servidor funcionando!");
});

app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
