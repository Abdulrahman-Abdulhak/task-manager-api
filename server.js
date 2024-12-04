import express from "express";

const app = express();
const port = 3000;

app.get("/hello", (req, res) => {
  res.send("Task Manage App");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
