import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await pool.query(`
      SELECT conditions, COUNT(*) as trials
      FROM us
      GROUP BY conditions
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching condition data', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default handler;
