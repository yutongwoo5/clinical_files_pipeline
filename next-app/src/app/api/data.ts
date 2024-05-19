import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../lib/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await query('SELECT * FROM us'); // Replace 'your_table' with your actual table name
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};

export default handler;
