import { Client } from 'pg';

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

client.connect();

export default async (req, res) => {
  const { type } = req.query;
  let query = '';

  if (type === 'sponsor') {
    query = 'SELECT sponsor, COUNT(*) as route FROM combined GROUP BY sponsor';
  } else if (type === 'conditions') {
    query = 'SELECT conditions, COUNT(*) as route FROM combined GROUP BY conditions';
  }

  const result = await client.query(query);
  res.status(200).json(result.rows);
};
