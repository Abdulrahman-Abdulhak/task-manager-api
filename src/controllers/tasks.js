import { Task } from "../db/index.js";

export const getAllTasks = async (req, res) => {
  console.log("getting all tasks");

  const [tasks] = await Task.getAll();
  res.json(tasks);
};

export const createTask = async (req, res) => {
  console.log("creating a task");

  let { title, details, completed } = req.body;

  const trimmedTitle = `${title}`.trim();

  if (title === null || title === undefined || !trimmedTitle.length) {
    res.status(400).json({ message: "must provide the title" });
    return;
  }

  if (trimmedTitle.length >= 20) {
    res.status(400).json({ message: "title can't be more than 20 characters" });
    return;
  }

  try {
    var [metaData] = await Task.create({
      title,
      details: `${details}`?.trim(),
      completed,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }

  const [[task]] = await Task.get({ id: metaData.insertId });
  res.json(task);
};

export const getTask = async (req, res) => {
  console.log("getting a task");
  const { id: taskId } = req.params;

  if (taskId === null || taskId === undefined) {
    res.status(400).json({ message: "missing task id" });
    return;
  }

  try {
    const [[task]] = await Task.get({ taskId });

    if (!task) {
      return res
        .status(404)
        .json({ message: `No task with id: ${taskId} was found` });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const updateTask = (req, res) => {
  console.log("updating a task");

  try {
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const deleteTask = async (req, res) => {
  console.log("deleting a task");

  const { id: taskId } = req.params;

  try {
    const [deletion, taskQuery] = await Task.del({ taskId });

    const [[deletedTask]] = taskQuery;
    if (!deletedTask) {
      return res.status(404).json({ message: "Task is not found to delete" });
    }

    res.json({ deletedTask, status: "success" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
