import { poolHostDB } from "./connect.js";

export const create = async ({ title, details = null, completed = null }) => {
  const pool = await poolHostDB();
  return await pool.query(
    `
    INSERT INTO tasks (title, details ${
      completed === null ? "" : ", completed"
    })
    VALUES(?, ? ${completed === null ? "" : ", ?"})
    `,
    completed === null ? [title, details] : [title, details, completed]
  );
};

export const get = async ({ taskId }) => {
  const pool = await poolHostDB();
  const query = pool.query(
    `
      SELECT * FROM tasks
      WHERE id = ?
      `,
    [taskId]
  );

  return query;
};

export const getAll = async () => {
  const pool = await poolHostDB();
  const query = pool.query(`SELECT * FROM tasks`);

  return query;
};

export const del = async ({ taskId }) => {
  const pool = await poolHostDB();

  const task = await get({ taskId });
  const deletion = task
    ? pool.query(
        `
        DELETE FROM tasks WHERE id = ?
    `,
        [taskId]
      )
    : null;

  return [deletion, task];
};

export const update = async ({ taskId, newTask }) => {
  const pool = await poolHostDB();

  const allowedFieldsUpdate = ["title", "details", "completed"];

  let updateString = "";
  let updateValues = [];

  for (const key in newTask) {
    if (!Object.prototype.hasOwnProperty.call(newTask, key)) continue;
    if (allowedFieldsUpdate.every((field) => field !== key)) continue;

    if (updateString.length) {
      updateString += ",";
    }

    updateString += `${key} = ?`;
    updateValues.push(newTask[key]);
  }

  if (!updateString.length) return null;

  const query = await pool.query(
    `
        UPDATE tasks
        SET ${updateString}
        WHERE id = ?
    `,
    [...updateValues, taskId]
  );

  return await get({ taskId });
};
