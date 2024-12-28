import { Task } from "../db/index.js";

export const getAllTasks = (req, res) => {
  console.log("getting all tasks");
  res.send("All tasks sent");
};

export const createTask = async (req, res) => {
  console.log("creating a task");

  let { title, details, completed } = req.body;

  if (title === null || title === undefined) {
    res.status(400).json({ message: "Missing task title" });
    return;
  }

  const [metaData] = await Task.create({ title, details, completed });
  const [[task]] = await Task.get({ id: metaData.insertId });
  res.json(task);
};

export const getTask = async (req, res) => {
  console.log("getting a task");
  const id = req.params.id;

  if (req.params.id === null || req.params.id === undefined) {
    res.status(400).json({ message: "Missing task id" });
    return;
  }

  const [[task]] = await Task.get({ id });
  res.json(task);
};

export const updateTask = (req, res) => {
  console.log("updating a task");
  res.json({ id: req.params.id, ...req.body });
};

export const deleteTask = (req, res) => {
  console.log("deleting a task");
  res.json({ id: req.params.id });
};
