import express from "express";
import dotenv from "dotenv";

import { poolDB } from "./db/index.js";
import { tasksRouter } from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/index.js";

dotenv.config();
const app = express();
const port = parseInt(process.env.SERVER_PORT ?? 3000);

const dbHost = process.env.DB_HOST;

//* middlewares
app.use(express.json());

//* routes
app.use("/api/v1/tasks", tasksRouter);
app.use(notFound);
app.use(errorHandler);

try {
  const pool = await poolDB(dbHost);
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
} catch (e) {
  console.error(e);
}
