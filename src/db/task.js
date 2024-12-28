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

export const get = async ({ id }) => {
  const pool = await poolDB();
  const query = pool.query(
    `
      SELECT * FROM tasks
      WHERE id = ?
      `,
    [id]
  );

  return query;
};
