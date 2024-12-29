import { Task } from "../db/index.js";
import { asyncWrapper } from "../middleware/index.js";
import { CustomApiError } from "../errors/index.js";

export const getAllTasks = asyncWrapper(async (req, res, next) => {
  console.log("getting all tasks");

  const [tasks] = await Task.getAll();
  res.json(tasks);
});

export const createTask = asyncWrapper(async (req, res, next) => {
  console.log("creating a task");

  let { title, details, completed } = req.body;

  const trimmedTitle = `${title}`.trim();

  if (title === null || title === undefined || !trimmedTitle.length) {
    return next(new CustomApiError("must provide the title", 400));
  }

  if (trimmedTitle.length >= 20) {
    return next(
      new CustomApiError("title can't be more than 20 characters", 400)
    );
  }

  var [metaData] = await Task.create({
    title,
    details: `${details}`?.trim(),
    completed,
  });

  const [[task]] = await Task.get({ id: metaData.insertId });
  res.json(task);
});

export const getTask = asyncWrapper(async (req, res, next) => {
  console.log("getting a task");
  const { id: taskId } = req.params;

  if (taskId === null || taskId === undefined) {
    return next(new CustomApiError("missing task id", 400));
  }

  const [[task]] = await Task.get({ taskId });

  if (!task) {
    return next(
      new CustomApiError(`no task with id: ${taskId} was found`, 404)
    );
  }

  res.json(task);
});

export const updateTask = asyncWrapper(async (req, res, next) => {
  console.log("updating a task");

  const { id: taskId } = req.params;
  const { body: newTask } = req;

  if (!newTask || !Object.keys(newTask).filter((key) => key !== "id").length) {
    return next(new CustomApiError("must specify fields to update", 400));
  }

  let { title } = newTask;

  if (Object.hasOwn(newTask, "title")) {
    const trimmedTitle = title?.trim();

    if (
      trimmedTitle === null ||
      trimmedTitle === undefined ||
      !trimmedTitle.length
    ) {
      return next(
        new CustomApiError("the title provided should not be empty", 400)
      );
    }

    if (trimmedTitle.length >= 20) {
      return next(
        new CustomApiError("title can't be more than 20 characters", 400)
      );
    }

    newTask.title = trimmedTitle;
  }

  const [[oldTask]] = await Task.get({ taskId });

  if (!oldTask) {
    return next(
      new CustomApiError(`no task with id: ${taskId} was found`, 404)
    );
  }

  const [[task]] = await Task.update({ taskId, newTask });
  res.json(task);
});

export const deleteTask = asyncWrapper(async (req, res, next) => {
  console.log("deleting a task");

  const { id: taskId } = req.params;

  const [deletion, taskQuery] = await Task.del({ taskId });

  const [[deletedTask]] = taskQuery;
  if (!deletedTask) {
    return next(
      new CustomApiError("task could not be found to be deleted", 404)
    );
  }

  res.json({ deletedTask, status: "success" });
});
