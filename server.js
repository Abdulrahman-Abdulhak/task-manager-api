import express from "express";
import { tasksRouter } from "./routes/index.js";

const app = express();
const port = 3000;

//* middlewares
app.use(express.json());

//* routes

app.use("/api/v1/tasks", tasksRouter);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
