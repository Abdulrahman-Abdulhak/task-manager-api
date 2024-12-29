import { poolDB } from "./connect.js";

export const create = async ({ title, details = null, completed = null }) => {
  const pool = await poolDB();
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
  const pool = await poolDB();
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
  const pool = await poolDB();
  const query = pool.query(`SELECT * FROM tasks`);

  return query;
};

export const del = async ({ taskId }) => {
  const pool = await poolDB();

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
