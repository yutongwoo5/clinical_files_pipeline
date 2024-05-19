// run-query.js
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

const runQuery = async () => {
  try {
    const result = await pool.query('SELECT * FROM us');
    console.log(result.rows);
  } catch (error) {
    console.error('Error fetching all data', error);
  } finally {
    await pool.end();
  }
};

runQuery();
