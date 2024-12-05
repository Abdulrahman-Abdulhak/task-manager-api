export const getAllTasks = (req, res) => {
  res.send("All tasks sent");
};

export const createTask = (req, res) => {
  res.json(req.body);
};

export const getTask = (req, res) => {
  res.send("get task");
};

export const updateTask = (req, res) => {
  res.send(req.body);
};

export const deleteTask = (req, res) => {
  res.send("task deleted");
};
