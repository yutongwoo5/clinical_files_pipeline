import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../lib/db'; // Adjust the path as needed

export const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await query('SELECT * FROM us');
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error in API route:', error);
    return res.status(500).json({ error: 'Error fetching data' });
  }
};

