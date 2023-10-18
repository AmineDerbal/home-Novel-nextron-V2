import getData from '../../../services/gerUrlData';
import { connectDb } from '../../../utils/db';
import { promisify } from 'util';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { url } = req.body;
      const response = await getData(url);
      return res.json(response);
    } catch (error) {
      // You can send a meaningful error response to the client
      return res
        .status(500)
        .json({ error: 'An error occurred while fetching the data' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    const db = connectDb();
    const runAsync = promisify(db.run.bind(db));

    try {
      const query = `DELETE FROM novels WHERE id = ?`;
      const values = [id];
      await runAsync(query, values);
      return res.json({ message: 'Novel deleted successfully' });
    } catch (error) {
      return res
        .status(500)
        .json({ error: 'An error occurred while deleting the novel' });
    } finally {
      db.close();
    }
  }
  return res.status(400).json({ error: 'Invalid request method' });
};

export default handler;
