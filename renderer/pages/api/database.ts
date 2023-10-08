import { serializeDb } from '../../utils/db';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      await serializeDb();
      res.json({ message: 'connected' });
    } catch (error) {
      res
        .status(500)
        .json({ error: 'An error occurred while fetching the data' });
    }
  } else {
    res.status(400).json({ error: 'Invalid request method' });
  }
  return 'No post';
};

export default handler;
